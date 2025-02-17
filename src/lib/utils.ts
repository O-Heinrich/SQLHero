/**
 * Helper functions for working with PostgreSQL data types.
 * 
 * @module lib/utils
 */

import { PgCell, PostgresTypeID } from "@/lib/types";

/**
 * Converts a Postgres record to a string array.
 * 
 * @param {PgCell[]} row - Postgres record to convert
 * @returns {string[]} Array of string values
 * 
 * @example
 * ```ts
 * const record: PgCell = { 
 *   firstname: 'herbert', 
 *   lastname: 'west', 
 *   birthdate: new Date(),
 * };
 * 
 * const values: string[] = queryRecordToStringArray(record);
 * console.log(values);
 * // Output: ['herbert', 'west', '2025-01-01T00:00:00.000Z']
 * ```
 */
export function queryRecordToStringArray(row: PgCell): string[] {
    const rowValues: unknown[] = Object.values(row);
    const len = rowValues.length;
    const values: string[] = new Array(len);

    for (let i = 0; i < len; i++) {
        const value = rowValues[i];
        if (value instanceof Date) {
            values.push((value as Date).toISOString());
        } else if (value instanceof Uint8Array) {
            values.push('Uint8Array[]');

        } else {
            values.push(value as string|null ?? 'NULL');
        }
    }

    return values;
}

/**
 * Checks if a given PostgreSQL type ID represents a date data type.
 * 
 * @param {number} typeID - PostgreSQL type ID to check
 * @returns {boolean} True if the type ID is a date type, false otherwise
 */
export function isPostrgesDateType(typeID: number): boolean {
    return typeID === PostgresTypeID.DATE || typeID === PostgresTypeID.TIMESTAMP;
}

/**
 * Checks if a given PostgreSQL type ID represents a numeric data type.
 * 
 * @param {number} typeID - PostgreSQL type ID to check
 * @returns {boolean} True if the type ID is a numeric type, false otherwise
 */ 
export function isPostgresNumericType(typeID: number): boolean {
    return typeID === PostgresTypeID.INTEGER || typeID === PostgresTypeID.BIGINT || typeID === PostgresTypeID.DECIMAL;
}

/**
 * Checks if a given PostgreSQL type ID represents a text data type.
 * 
 * @param {number} typeID - PostgreSQL type ID to check
 * @returns {boolean} True if the type ID is a text type, false otherwise
 */
export function isPostgresTextType(typeID: number): boolean {
    return typeID === PostgresTypeID.CHAR || typeID === PostgresTypeID.VARCHAR || typeID === PostgresTypeID.TEXT;
}

/**
 * Checks if a given PostgreSQL type ID represents an array data type.
 * 
 * @param {number} typeID - PostgreSQL type ID to check
 * @returns {boolean} True if the type ID is an array type, false otherwise
 */
export function isPostgresArrayType(typeID: number): boolean {
    return typeID === PostgresTypeID.INTEGER_ARRAY || typeID === PostgresTypeID.TEXT_ARRAY;
}

/**
 * Checks if a given PostgreSQL type ID represents a range data type.
 * 
 * @param {number} typeID - PostgreSQL type ID to check
 * @returns {boolean} True if the type ID is a range type, false otherwise
 */
export function isPostgresRangeType(typeID: number): boolean {
    return typeID === PostgresTypeID.INT4RANGE || typeID === PostgresTypeID.INT8RANGE || typeID === PostgresTypeID.NUMRANGE;
}

/**
 * Checks if a given PostgreSQL type ID represents a JSON data type.
 * 
 * @param {number} typeID - PostgreSQL type ID to check
 * @returns {boolean} True if the type ID is a JSON type, false otherwise
 */
export function isPostgresJSONType(typeID: number): boolean {
    return typeID === PostgresTypeID.JSON || typeID === PostgresTypeID.JSONB;
}
