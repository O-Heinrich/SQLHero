/**
 * Helper functions for working with PostgreSQL data types.
 * 
 * @module lib/utils
 */

import { PostgresTypeID, QueryResult } from "@/lib/types";

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