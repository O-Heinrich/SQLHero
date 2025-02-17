import { PgCell } from "@/lib/types";

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