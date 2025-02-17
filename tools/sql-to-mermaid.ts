/**
 * @module SQLToMermaidParser
 * @description
 * A module that converts SQL CREATE TABLE statements into Mermaid.js ER diagram syntax.
 * Handles complex table definitions including columns, data types, constraints, and relationships.
 */

import { Parser } from 'node-sql-parser';
import { readFileSync } from 'fs';

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
 * SQL to Mermaid.js ER Diagram Parser
 * @class
 * @description
 * Converts SQL CREATE TABLE statements into Mermaid.js entity-relationship diagram syntax.
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
class SQLToMermaidParser {
    private parser: Parser;
    private tables: Map<string, Table>;

    /**
     * Initializes a new SQLToMermaidParser instance
     * @constructor
     */
    constructor() {
        this.parser = new Parser();
        this.tables = new Map();
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

        return this.generateMermaid();
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
                mermaid += `    ${table.name} }|--|| ${fk.toTable} : "${fk.fromColumn}"\n`;
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
}

// Example usage
const parser = new SQLToMermaidParser();
const sql = readFileSync(process.argv[2], 'utf-8').toString();
const mermaidOutput = parser.parse(sql);
console.log(mermaidOutput);
// writeFileSync('output.mmd', mermaidOutput);