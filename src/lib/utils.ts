/**
 * Helper functions for working with PostgreSQL data types.
 * 
 * @module lib/utils
 */

import { PostgresTypeID, ResultComparison, StatementType, TableDiff } from "@/lib/types";
import { QueryResult } from "./exec-engine/postgres-engine";

/**
 * Converts a JavaScript value to a string representation based on the PostgreSQL type context.
 * 
 * @param {unknown} value - The JavaScript value to convert. This can be any type, including numbers, strings, dates, booleans, objects, or binary data.
 * @param {PostgresTypeID} [typeId] - The PostgreSQL type ID (optional). If provided, it is used to determine the appropriate string representation for the value.
 * @returns {string} - The string representation of the value. If the value is `null` or `undefined`, it returns `'NULL'`. For unsupported types, it falls back to `String(value)`.
 * 
 * @example
 * ```ts
 * const numericValue = jsValueToString(123, PostgresTypeID.INTEGER); // '123'
 * const dateValue = jsValueToString(new Date(), PostgresTypeID.DATE); // '2025-02-17T00:00:00.000Z'
 * const jsonValue = jsValueToString({ key: 'value' }, PostgresTypeID.JSONB); // '{"key":"value"}'
 * ```
 */
export function jsValueToString(value: unknown, typeId?: PostgresTypeID): string {
    // Handle null or undefined values
    if (value === null || value === undefined) {
        return 'NULL';
    }

    // Handle specific PostgreSQL types
    switch (typeId) {
        // Numeric Types
        case PostgresTypeID.SMALLINT:
        case PostgresTypeID.INTEGER:
        case PostgresTypeID.BIGINT:
        case PostgresTypeID.REAL:
        case PostgresTypeID.DOUBLE_PRECISION:
        case PostgresTypeID.MONEY:
            return String(value); // Numbers to string

        // Character Types
        case PostgresTypeID.CHAR:
        case PostgresTypeID.VARCHAR:
        case PostgresTypeID.TEXT:
        case PostgresTypeID.UUID:
        case PostgresTypeID.INET:
        case PostgresTypeID.CIDR:
        case PostgresTypeID.MACADDR:
        case PostgresTypeID.MACADDR8:
        case PostgresTypeID.XML:
            return String(value); // Strings to string

        // Binary Types
        case PostgresTypeID.BYTEA:
            return value instanceof Uint8Array ? 'Uint8Array[]' : String(value);

        // Date/Time Types
        case PostgresTypeID.DATE:
        case PostgresTypeID.TIME:
        case PostgresTypeID.TIME_WITH_TIMEZONE:
        case PostgresTypeID.TIMESTAMP:
        case PostgresTypeID.TIMESTAMP_WITH_TIMEZONE:
            return value instanceof Date ? value.toISOString() : String(value);

        // Boolean Type
        case PostgresTypeID.BOOLEAN:
            return value ? 'true' : 'false';

        // JSON Types
        case PostgresTypeID.JSON:
        case PostgresTypeID.JSONB:
            return typeof value === 'string' ? value : JSON.stringify(value);

        // Default Fallback
        default:
            return String(value);
    }
}

/**
 * Converts a PostgreSQL query result into an object containing columns and rows as string arrays.
 * Each value in the rows is converted to a string based on its corresponding PostgreSQL type.
 * It uses a well-optimized algorithm to minimize memory usage and improve performance, even
 * with large datasets.
 * 
 * @param {QueryResult} result - The PostgreSQL query result to convert. This includes `fields` (metadata about the columns) and `rows` (the actual data).
 * @returns {Object} An object containing:
 *   - `columns`: An array of column names as strings.
 *   - `rows`: A 2D array of strings, where each inner array represents a row of stringified values.
 * 
 * @example
 * ```ts
 * const result = {
 *   fields: [
 *     { name: 'id', dataTypeID: PostgresTypeID.INTEGER },
 *     { name: 'name', dataTypeID: PostgresTypeID.TEXT },
 *   ],
 *   rows: [
 *     { id: 1, name: 'Alice' },
 *     { id: 2, name: 'Bob' },
 *   ],
 * };
 * 
 * const { columns, rows } = queryResultToStringArray(result);
 * console.log(columns); // ['id', 'name']
 * console.log(rows);    // [['1', 'Alice'], ['2', 'Bob']]
 * ```
 */
export function queryResultToStringArray({ fields, rows }: QueryResult): { columns: string[], rows: string[][] } {
    const rowsLen = rows.length; // Number of rows in the query result
    const columns: string[] = new Array(fields.length); // Pre-allocate columns array
    const fieldTypeMapping = new Map<string, PostgresTypeID>(); // Map to store field types

    // Populate columns and fieldTypeMapping in a single iteration
    for (let i = 0; i < fields.length; i++) {
        columns[i] = fields[i].name; // Direct assignment to avoid empty slots
        fieldTypeMapping.set(fields[i].name, fields[i].dataTypeID);
    }

    const stringRows: string[][] = new Array(rowsLen); // Pre-allocate rows array

    for (let i = 0; i < rowsLen; i++) {
        const row = rows[i];
        const stringRow: string[] = new Array(fields.length); // Pre-allocate row array

        for (let j = 0; j < fields.length; j++) {
            const key = fields[j].name; // Get the column name
            const value = row[key]; // Get the value for the current column
            stringRow[j] = jsValueToString(value, fieldTypeMapping.get(key)); // Convert to string
        }

        stringRows[i] = stringRow; // Assign the row to the result
    }

    return {
        columns,
        rows: stringRows,
    };
}

/**
 * Custom error class representing a situation where a solution hash is not found.
 * 
 * @extends {Error}
 */
export class SolutionHashNotFountError extends Error {
    constructor(key: string) {
        super(`Solution hash not found for key: ${key}`);
    }
}

/**
 * Result Set Comparison Utility Module
 * 
 * This module provides utility methods for comparing and analyzing query result sets,
 * specifically designed for comparing student submissions against solution sets.
 * 
 * Key Features:
 * - Solution hash storage and retrieval
 * - Result set comparison
 * - Detailed difference analysis between result sets
 * 
 * @example
 * ```ts
 * const solution = {
 *  fields: [
 *      { name: 'id', dataTypeID: PostgresTypeID.INTEGER },
 *      { name: 'name', dataTypeID: PostgresTypeID.TEXT },
 * ],
 * rows: [
 *      { id: 1, name: 'Alice' },
 *      { id: 2, name: 'Bob' },
 *  ],
 * };
 * 
 * ResultSetComparison.storeSolutionHash('exercise-1', solution);
 * 
 * const result = {
 * fields: [
 *     { name: 'id', dataTypeID: PostgresTypeID.INTEGER },
 *     { name: 'name', dataTypeID: PostgresTypeID.TEXT },
 *  ],
 *  rows: [
 *      { id: 1, name: 'Alice' },
 *      { id: 2, name: 'Bob' },
 *  ],
 * };
 * 
 * const isMatch = ResultSetComparison.compareWithSolution('exercise-1', result);
 * console.log(isMatch); // true
 * ```
 */
export class ResultSetComparison {
    /** 
     * Internal storage for solution hashes, keyed by exercise ID 
     */
    private static solutionHashes: Map<string, string[]> = new Map();

    /**
     * Checks if a solution hash exists for a given exercise
     * 
     * @param exerciseId - Unique identifier for the exercise
     * @returns Boolean indicating presence of a solution hash
     */
    public static hasSolution(exerciseId: string): boolean {
        return ResultSetComparison.solutionHashes.has(exerciseId);
    }

    /**
     * Generates a hash for a result set by hashing its columns and rows.
     * 
     * @param {ResultComparison} comparison - The result set to hash.
     * @returns {string[]} - The hashes of the columns and rows.
     */
    private static hashResultSet(comparison: ResultComparison): string[] {
        const len = comparison.rows.length + Math.min(1, comparison.rows.length);
        const hashes = new Array<string>(len);

        hashes[0] = comparison.columns.join(',');
        for (let i = 0; i < comparison.rows.length; i++) {
            hashes[i + 1] = comparison.rows[i].join(',');
        }

        return hashes;
    }

    /**
     * Stores the hash of a solution result set for a given exercise ID.
     * 
     * @param {string} exerciseId - The ID of the exercise.
     * @param {QueryResult} solution - The solution result set.
     */
    public static storeSolutionHash(exerciseId: string, solution: QueryResult): ResultSetComparison {
        const serialized = queryResultToStringArray(solution);
        const hash = this.hashResultSet(serialized);
        this.solutionHashes.set(exerciseId, hash);
        return this;
    }

    /**
     * Compares a result set with the stored solution for a given exercise ID.
     * 
     * @param {string} exerciseId - The ID of the exercise.
     * @param {QueryResult} result - The result set to compare.
     * @returns {boolean} - `true` if the result matches the solution, `false` otherwise.
     * @throws {SolutionHashNotFountError} - If no solution hash is found for the given exercise ID.
     */
    static compareWithSolution(exerciseId: string, result: QueryResult): boolean {
        const solutionHash = this.solutionHashes.get(exerciseId);
        if (!solutionHash) {
            throw new SolutionHashNotFountError(exerciseId);
        }

        const serialized = queryResultToStringArray(result);
        const hash = this.hashResultSet(serialized);
        for (let i = 0; i < solutionHash.length; i++) {
            if (solutionHash[i] !== hash[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gets the differences between a solution result set and a student result set.
     * 
     * @param {QueryResult} solution - The solution result set.
     * @param {QueryResult} result - The student result set.
     * @returns {TableDiff} - An object containing the differences between the solution and the result.
     */
    static getDifference(solution: QueryResult, result: QueryResult): TableDiff {
        const solutionSerialized = queryResultToStringArray(solution);
        const studentSerialized = queryResultToStringArray(result);

        const differences = {
            missingColumns: [] as string[],
            extraColumns: [] as string[],
            mismatchedRows: [] as Array<{
                rowIndex: number;
                differences: Array<{
                    column: string;
                    expected: string;
                    received: string;
                }>;
            }>,
        };

        const solutionColumns = new Set(solutionSerialized.columns);
        const studentColumns = new Set(studentSerialized.columns);

        differences.missingColumns = solutionSerialized.columns.filter(col => !studentColumns.has(col));
        differences.extraColumns = studentSerialized.columns.filter(col => !solutionColumns.has(col));

        if (differences.missingColumns?.length > 0 || differences.extraColumns?.length > 0) {
            return differences;
        }

        const solutionRowMap = new Map(
            solutionSerialized.rows.map(row => [row.join(), row])
        );

        studentSerialized.rows.forEach((studentRow, rowIndex) => {
            const rowHash = studentRow.join();
            if (!solutionRowMap.has(rowHash)) {
                // Find closest matching row for detailed feedback
                const mismatchedColumns: Array<{
                    column: string;
                    expected: string;
                    received: string;
                }> = [];

                // Find the best matching solution row
                let minDifferences = Infinity;
                let bestMatchRow: string[] | null = null;

                for (const solutionRow of solutionRowMap.values()) {
                    let differences = 0;
                    for (let i = 0; i < solutionRow.length; i++) {
                        if (solutionRow[i] !== studentRow[i]) {
                            differences++;
                        }
                    }
                    if (differences < minDifferences) {
                        minDifferences = differences;
                        bestMatchRow = solutionRow;
                    }
                }

                if (bestMatchRow) {
                    for (let i = 0; i < studentRow.length; i++) {
                        if (studentRow[i] !== bestMatchRow[i]) {
                            mismatchedColumns.push({
                                column: solutionSerialized.columns[i],
                                expected: bestMatchRow[i],
                                received: studentRow[i]
                            });
                        }
                    }
                }

                differences.mismatchedRows.push({
                    rowIndex,
                    differences: mismatchedColumns
                });
            }
        });

        return differences;
    }
}

/**
 * Determines the SQL statement type based on the provided SQL query string.
 * 
 * This function analyzes the input SQL statement(s) by splitting on semicolons,
 * examining each statement, and returning the type of the first valid statement
 * that matches one of the SQL statement types (DDL, DML, TCL, DCL).
 *
 * When multiple statements are present (separated by semicolons), precedence is
 * given to DDL statements, followed by DML, TCL, and DCL.
 *
 * @param stmt - The SQL statement string to analyze (can contain multiple statements)
 * @returns The identified {@link StatementType} or null if no type can be determined
 * 
 * @example
 * // Returns StatementType.DDL (prioritizes the DROP statement)
 * getStmtType('SELECT * FROM users WHERE id = 1; DROP TABLE users;');
 * 
 * @example
 * // Returns StatementType.DML
 * getStmtType('SELECT * FROM users WHERE id = 1;');
 * 
 * @example
 * // Returns null for unrecognized statements
 * getStmtType('EXPLAIN ANALYZE SELECT * FROM users');
 */
export function getStmtType(stmt: string): StatementType|null {
    const statements = stmt.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    // Check for DDL statements first
    for (const statement of statements) {
        const words = statement.toUpperCase().split(' ');
        if (words.some(word => ['CREATE', 'ALTER', 'DROP'].includes(word))) {
            return StatementType.DDL;
        }
    }
    
    // Check for DML statements
    for (const statement of statements) {
        const words = statement.toUpperCase().split(' ');
        if (words.some(word => ['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(word))) {
            return StatementType.DML;
        }
    }
    
    // Check for TCL statements
    for (const statement of statements) {
        const words = statement.toUpperCase().split(' ');
        if (words.some(word => ['BEGIN', 'COMMIT', 'ROLLBACK'].includes(word))) {
            return StatementType.TCL;
        }
    }
    
    // Check for DCL statements
    for (const statement of statements) {
        const words = statement.toUpperCase().split(' ');
        if (words.some(word => ['GRANT', 'REVOKE'].includes(word))) {
            return StatementType.DCL;
        }
    }
    
    return null;
}