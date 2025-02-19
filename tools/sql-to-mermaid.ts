/**
 * @module SQLToMermaidParser
 * @description
 * A module that converts SQL CREATE TABLE statements into Mermaid.js ER diagram syntax.
 * Handles complex table definitions including columns, data types, constraints, and relationships.
 */

import { Parser } from 'node-sql-parser';
import { readFileSync } from 'fs';
import { basename } from 'path';
import { ErrorLike } from 'bun';

/**
 * Represents a database column definition
 * @interface
 * @property {string} name - The name of the column
 * @property {string} type - SQL data type of the column
 * @property {string[]} constraints - Array of column constraints (PK, UQ, NOT NULL, etc.)
 */
type Column = {
    name: string;
    type: string;
    constraints: string[];
};

/**
 * Represents a complete database table definition
 * @interface
 * @property {string} name - The name of the table
 * @property {Column[]} columns - Array of column definitions
 * @property {ForeignKey[]} foreignKeys - Array of foreign key relationships
 */
type Table = {
    name: string;
    columns: Column[];
    foreignKeys: ForeignKey[];
};

/**
 * Represents a foreign key relationship between tables
 * @interface
 * @property {string} fromColumn - Source column name
 * @property {string} toTable - Referenced table name
 * @property {string} toColumn - Referenced column name
 */
type ForeignKey = {
    fromColumn: string;
    toTable: string;
    toColumn: string;
};

/**
 * Represents the output format for the ER diagram
 * @type
 */
type ErdFormat = 'mermaid' | 'dot';

/**
* Error thrown when an invalid ER diagram format is specified
* @class
* @extends {Error}
* @description
* Custom error class for handling invalid format specifications
* in ER diagram generation. Used when a format other than the
* supported 'mermaid' or 'dot' is requested.
* 
* @example
* ```typescript
* try {
*   parser.setFormat('invalid');
* } catch (error) {
*   if (error instanceof IllegalFormatError) {
*     console.error('Invalid format specified:', error.message);
*   }
* }
* ```
*/
class IllegalFormatError extends Error {
    /**
    * Creates a new IllegalFormatError instance
    * @constructor
    * @param {string} message - Error message describing the format violation
    */
    constructor(message: string) {
        super(message);
        this.name = 'IllegalFormatError';
    }
}

/**
 * SQL to ER Diagram Parser
 * @class
 * @description
 * Converts SQL CREATE TABLE statements into Mermaid.js or Graphviz Dot entity-relationship diagram syntax.
 * Supports parsing of complex table structures including:
 * - Column definitions with data types
 * - Primary and unique key constraints
 * - Foreign key relationships
 * - Nullable/non-nullable columns
 * 
 * @example
 * ```typescript
 * const parser = new SQLToMermaidParser();
 * const sql = `
 *   CREATE TABLE users (
 *     id INT PRIMARY KEY,
 *     name VARCHAR(255) NOT NULL
 *   );
 * `;
 * const mermaid = parser.parse(sql);
 * ```
 */
class SQLToErdParser {
    private parser: Parser;
    private tables: Map<string, Table>;
    private format: ErdFormat;

    /**
     * Initializes a new SQLToMermaidParser instance
     * @constructor
     */
    constructor(format: ErdFormat = 'mermaid') {
        this.parser = new Parser();
        this.tables = new Map();
        this.format = format;
    }

    /**
     * Parses SQL CREATE TABLE statements into Mermaid.js ER diagram syntax
     * @param {string} sql - SQL CREATE TABLE statement(s)
     * @returns {string} Mermaid.js ER diagram representation
     */
    parse(sql: string): string {
        // Parse SQL into AST
        const ast = this.parser.astify(sql, { database: 'postgresql' });

        if (Array.isArray(ast)) {
            // Process each CREATE TABLE statement
            for (const stmt of ast) {
                if (stmt.type === 'create') {
                    this.processCreateTable(stmt);
                }
            }
        } else {
            // Process single CREATE TABLE statement
            this.processCreateTable(ast);
        }

        return this.format === 'mermaid' 
            ? this.generateMermaid() 
            : this.generateDot();
    }

    /**
     * Processes a single CREATE TABLE statement
     * @private
     * @param {any} stmt - AST representation of CREATE TABLE statement
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private processCreateTable(stmt: any): void {
        const tableName = stmt.table[0].table;
        const columns: Column[] = [];
        const foreignKeys: ForeignKey[] = [];

        // Process columns
        for (const col of stmt.create_definitions) {
           
            if (col.resource === 'column') {
                columns.push({
                    name: col.column.column.expr.value,
                    type: col.definition.dataType,
                    constraints: this.extractConstraints(col.definition)
                });
            } else if (col.resource === 'constraint' && col.constraint_type === 'FOREIGN KEY') {
                foreignKeys.push({
                    fromColumn: col.definition[0].column.expr.value,
                    toTable: col.reference_definition.table[0].table,
                    toColumn: col.reference_definition.definition[0].column.expr.value
                });
            }
        }

        this.tables.set(tableName, { name: tableName, columns, foreignKeys });
    }

    /**
     * Extracts column constraints from column definition
     * @private
     * @param {any} definition - Column definition object from AST
     * @returns {string[]} Array of constraint identifiers
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private extractConstraints(definition: any): string[] {
        const constraints: string[] = [];

        if (definition.primary_key) constraints.push('PK');
        if (definition.unique) constraints.push('UQ');
        if (definition.nullable === false) constraints.push('NOT NULL');

        return constraints;
    }

    /**
     * Generates Mermaid.js ER diagram syntax from parsed tables
     * @private
     * @returns {string} Complete Mermaid.js ER diagram definition
     */
    private generateMermaid(): string {
        let mermaid = 'erDiagram\n';

        // Generate entities and their attributes
        for (const [, table] of this.tables) {
            for (const fk of table.foreignKeys) {
                mermaid += `    ${this.escapeLabel(table.name)} }|--|| ${fk.toTable} : "${fk.fromColumn}"\n`;
            }
        }

        // Generate detailed entity definitions
        for (const [tableName, table] of this.tables) {
            mermaid += `    ${tableName} {\n`;
            for (const column of table.columns) {
                const constraints = column.constraints.length > 0
                    ? ` [${column.constraints.join(', ')}]`
                    : '';
                mermaid += `        ${column.type} ${column.name}${constraints}\n`;
            }
            mermaid += '    }\n';
        }

        return mermaid;
    }

    /**
     * Generates a complete DOT language representation of the database schema
     * @private
     * @returns {string} A complete DOT language graph definition
     * @description
     * Creates a DOT language graph that visualizes the database schema as an ER diagram.
     * The generated graph includes:
     * - Right-to-left layout direction
     * - Custom node styling for tables
     * - Crow's foot notation for relationships
     * - Custom font settings for better readability
     * - Table nodes with column details
     * - Foreign key relationship edges with labels
     * 
     * @example
     * ```typescript
     * // The generated DOT will look like:
     * digraph ERDiagram {
     *   // Node and edge styling
     *   // Table definitions
     *   // Relationship edges
     * }
     * ```
     */
    private generateDot(): string {
        let dot = 
`digraph ERDiagram {
    rankdir=RL;
    node [shape=plaintext, fontname="Arial"];
    edge [dir=both, arrowhead=crow, arrotail=none, fontname="Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"];\n`;

        for (const [, table] of this.tables) {
            dot += this.generateTableNode(table) + '\n';
        }

        for (const [, table] of this.tables) {
            for (const fk of table.foreignKeys) {
                dot += `    "${table.name}" -> "${fk.toTable}" `;
                dot += `[label="${fk.fromColumn} -> ${fk.toColumn}"];\n`;
            }
        }

        dot += '}';
        return dot;
    }

    /**
     * Generates a DOT language node representation of a database table
     * @private
     * @param {Table} table - The table object containing name, columns, and relationships
     * @returns {string} A DOT language node string with HTML-like label formatting
     * @description
     * Creates a formatted table node for use in GraphViz DOT diagrams.
     * The node includes:
     * - Table name as header
     * - Columns with their types and constraints
     * - Gradient background styling
     * - HTML-like table formatting
     * 
     * @example
     * ```typescript
     * const tableNode = generateTableNode({
     *   name: 'users',
     *   columns: [
     *     { name: 'id', type: 'INT', constraints: ['PK'] }
     *   ],
     *   foreignKeys: []
     * });
     * ```
     */
    private generateTableNode(table: Table): string {
        const columnSelection = 
            '<tr><td><b>' 
            + table.name 
            + '</b></td></tr>\n\t<tr>' 
            + table.columns.map(col => {
                const constraints =  col.constraints.length > 0
                    ? ` [${col.constraints.join(', ')}]`
                    : '';
                return `<td>${this.escapeLabel(col.name)}: ${col.type}${constraints}</td>`;
            }).join('</tr>\n\t<tr>');

        return `    ${table.name} [label=<<table gradientangle="45" bgcolor="#eeebeb:#bbbbbb" border="0" cellborder="1" cellspacing="0" cellpadding="2">\n\t${columnSelection}</tr>\n</table>>];`;
    }

    /**
     * Escapes double quotes in label strings for DOT syntax
     * @private
     * @param {string} label - The raw label text to escape
     * @returns {string} Escaped label string safe for DOT syntax
     * @description
     * Ensures labels containing double quotes are properly escaped
     * to maintain valid DOT syntax.
     * 
     * @example
     * ```typescript
     * const escaped = escapeLabel('contains "quotes"');
     * // Result: contains \"quotes\"
     * ```
     */
    private escapeLabel(label: string): string {
        return label.replace(/"/g, '\\"');
    }

    /**
     * Sets the output format for the ER diagram
     * @public
     * @param {ErdFormat} format - The desired output format ('mermaid' or 'dot')
     * @throws {IllegalFormatError} If an invalid format is specified
     * @description
     * Configures the parser to generate either Mermaid.js or DOT syntax.
     * Must be called before generating the diagram.
     * 
     * @example
     * ```typescript
     * parser.setFormat('mermaid'); // Set output to Mermaid.js format
     * parser.setFormat('dot');     // Set output to DOT format
     * ```
     */
    public setFormat(format: ErdFormat): void {
        if (format !== 'mermaid' && format !== 'dot') {
            throw new IllegalFormatError(`Invalid ER diagram format: ${format}`);
        }

        this.format = format;
    }
}


const parser = new SQLToErdParser('dot');
const sql = readFileSync(process.argv[2], 'utf-8').toString();
const graph = parser.parse(sql);
const fileName = basename(process.argv[2], '.sql');
const proc = Bun.spawn(["dot", `-Tsvg`, `-o`, `${fileName}.svg`], {
    cwd: "./",
    env: process.env,
    stdin: "pipe",
    onExit(proc: unknown, exitCode: number, signalCode: number, error: ErrorLike | undefined) {
        if (exitCode === 0) {
            console.log(`Generated ${fileName}.svg`);
        } else {
            console.error(`Error generating ${fileName}.svg: ${error}`);
        }
    },
});

proc.stdin.write(graph);
proc.stdin.flush();
proc.stdin.end();