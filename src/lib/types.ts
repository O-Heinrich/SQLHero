/**
* Types and interfaces for the challenge application state management.
* 
* @description  This module defines the data structures used to represent challenges and the global application state.
*               It also includes helper functions and enumerations for working with PostgreSQL data types.
* 
* @note         If more helpers are added, consider moving them to a separate utils file for better organization.
* @module       lib/types
*/

/**
* Represents a single challenge entity.
* Tracks challenge metadata including completion status and attempt history.
*/
export interface Challenge {
    /** Unique number identifier for the challenge */
    no: number;

    /** Display title of the challenge */
    title: string;

    /** Whether the challenge has been successfully completed */
    completed: boolean;

    /** Whether the challenge has been attempted at least once */
    attempted: boolean;

    /** Timestamp of the most recent attempt, if any */
    lastAttempt?: Date;
}

/**
* Global application state interface.
* Contains challenges data and UI-related state.
*/
export interface AppState {
    /** Map of challenge IDs to Challenge objects */
    challenges: Record<string, Challenge>;

    /** Reference to header DOM element for scroll animations */
    headerElement: HTMLHeadingElement | null;

    /** ID of the currently active challenge, if any */
    currentChallenge?: string;
}

/**
 * Represents the field structure of a PostgreSQL table.
 */
export interface PgField { 
    name: string, 
    dataTypeID: number 
};

/**
 * Represents a single cell value in a PostgreSQL table.
*/
export type PgCell = Record<string, unknown>;

/**
 * Represents the structure of a SQL query execution result
 * @interface
 * @property {Object[]} fields - Array of column definitions
 * @property {string} fields[].name - Name of each column
 * @property {number} fields[].dataTypeId - Data type ID of each column
 * @property {Record<string, unknown>[]} rows - Array of result rows
 */
export interface QueryResult {
    fields: PgField[];
    rows: PgCell[];
}

/**
* Union type defining all possible actions that can modify the app state.
* Each action has a specific type identifier and associated payload data.
*/
export type ChallengeAction =
    /** Marks a challenge as completed */
    | { type: 'COMPLETE_CHALLENGE'; payload: { id: string } }

    /** Records an attempt on a challenge */
    | { type: 'ATTEMPT_CHALLENGE'; payload: { id: string } }

    /** Updates the header element reference */
    | { type: 'SET_HEADER_REF'; payload: HTMLHeadingElement }

    /** Sets the currently active challenge */
    | { type: 'SET_CURRENT_CHALLENGE'; payload: string }

    /** Initializes the challenges list */
    | { type: 'INIT_CHALLENGES'; payload: Challenge[] };

// Note: Could be possibly removed in the future. Proper type checking works fine.

/**
 * Enumeration of PostgreSQL data type Object Identifiers (OIDs).
 * These values represent the internal type identifiers used by PostgreSQL to uniquely identify data types.
 * @enum {number}
 */
export enum PostgresTypeID {
    // Numeric Types
    SMALLINT = 21,
    INTEGER = 23,
    BIGINT = 20,
    DECIMAL = 1700,
    REAL = 700,
    DOUBLE_PRECISION = 701,
    MONEY = 790,

    // Character Types
    CHAR = 1042,
    VARCHAR = 1043,
    TEXT = 25,

    // Binary Types
    BYTEA = 17,

    // Date/Time Types
    DATE = 1082,
    TIME = 1083,
    TIME_WITH_TIMEZONE = 1266,
    TIMESTAMP = 1114,
    TIMESTAMP_WITH_TIMEZONE = 1184,
    INTERVAL = 1186,

    // Boolean Type
    BOOLEAN = 16,

    // Geometric Types
    POINT = 600,
    LINE = 628,
    LSEG = 601,
    BOX = 603,
    PATH = 602,
    POLYGON = 604,
    CIRCLE = 718,

    // Network Address Types
    INET = 869,
    CIDR = 650,
    MACADDR = 829,
    MACADDR8 = 774,

    // Bit String Types
    BIT = 1560,
    BIT_VARYING = 1562,

    // Text Search Types
    TSVECTOR = 3614,
    TSQUERY = 3615,

    // UUID Type
    UUID = 2950,

    // XML Type
    XML = 142,

    // JSON Types
    JSON = 114,
    JSONB = 3802,

    // Array Types
    INTEGER_ARRAY = 1007,
    TEXT_ARRAY = 1009,

    // Range Types
    INT4RANGE = 3904,
    INT8RANGE = 3926,
    NUMRANGE = 3906,
    TSRANGE = 3908,
    TSTZRANGE = 3910,
    DATERANGE = 3912
}

/**
 * Map of PostgreSQL type IDs to their possible names (including aliases).
 * Using Map for O(1) lookup performance instead of a regular object.
 */
export const PostgresTypeAliases = new Map<number, string[]>([
    [PostgresTypeID.INTEGER, ['INTEGER', 'SERIAL']],
    [PostgresTypeID.BIGINT, ['BIGINT', 'BIGSERIAL']],
    [PostgresTypeID.SMALLINT, ['SMALLINT', 'SMALLSERIAL']],
    [PostgresTypeID.DECIMAL, ['DECIMAL', 'NUMERIC']]
]);

/**
 * Map of all PostgreSQL type IDs to their possible names (including aliases).
 * Provides O(1) lookup for all type IDs.
 */
export const PostgresTypeNames = new Map<number, string[]>([
    // Numeric Types
    [PostgresTypeID.SMALLINT, ['SMALLINT', 'SMALLSERIAL']],
    [PostgresTypeID.INTEGER, ['INTEGER', 'SERIAL']],
    [PostgresTypeID.BIGINT, ['BIGINT', 'BIGSERIAL']],
    [PostgresTypeID.DECIMAL, ['DECIMAL', 'NUMERIC']],
    [PostgresTypeID.REAL, ['REAL']],
    [PostgresTypeID.DOUBLE_PRECISION, ['DOUBLE_PRECISION']],
    [PostgresTypeID.MONEY, ['MONEY']],

    // Character Types
    [PostgresTypeID.CHAR, ['CHAR']],
    [PostgresTypeID.VARCHAR, ['VARCHAR']],
    [PostgresTypeID.TEXT, ['TEXT']],

    // Binary Types
    [PostgresTypeID.BYTEA, ['BYTEA']],

    // Date/Time Types
    [PostgresTypeID.DATE, ['DATE']],
    [PostgresTypeID.TIME, ['TIME']],
    [PostgresTypeID.TIME_WITH_TIMEZONE, ['TIME_WITH_TIMEZONE']],
    [PostgresTypeID.TIMESTAMP, ['TIMESTAMP']],
    [PostgresTypeID.TIMESTAMP_WITH_TIMEZONE, ['TIMESTAMP_WITH_TIMEZONE']],
    [PostgresTypeID.INTERVAL, ['INTERVAL']],

    // Boolean Type
    [PostgresTypeID.BOOLEAN, ['BOOLEAN']],

    // Geometric Types
    [PostgresTypeID.POINT, ['POINT']],
    [PostgresTypeID.LINE, ['LINE']],
    [PostgresTypeID.LSEG, ['LSEG']],
    [PostgresTypeID.BOX, ['BOX']],
    [PostgresTypeID.PATH, ['PATH']],
    [PostgresTypeID.POLYGON, ['POLYGON']],
    [PostgresTypeID.CIRCLE, ['CIRCLE']],

    // Network Address Types
    [PostgresTypeID.INET, ['INET']],
    [PostgresTypeID.CIDR, ['CIDR']],
    [PostgresTypeID.MACADDR, ['MACADDR']],
    [PostgresTypeID.MACADDR8, ['MACADDR8']],

    // Bit String Types
    [PostgresTypeID.BIT, ['BIT']],
    [PostgresTypeID.BIT_VARYING, ['BIT_VARYING']],

    // Text Search Types
    [PostgresTypeID.TSVECTOR, ['TSVECTOR']],
    [PostgresTypeID.TSQUERY, ['TSQUERY']],

    // UUID Type
    [PostgresTypeID.UUID, ['UUID']],

    // XML Type
    [PostgresTypeID.XML, ['XML']],

    // JSON Types
    [PostgresTypeID.JSON, ['JSON']],
    [PostgresTypeID.JSONB, ['JSONB']],

    // Array Types
    [PostgresTypeID.INTEGER_ARRAY, ['INTEGER_ARRAY']],
    [PostgresTypeID.TEXT_ARRAY, ['TEXT_ARRAY']],

    // Range Types
    [PostgresTypeID.INT4RANGE, ['INT4RANGE']],
    [PostgresTypeID.INT8RANGE, ['INT8RANGE']],
    [PostgresTypeID.NUMRANGE, ['NUMRANGE']],
    [PostgresTypeID.TSRANGE, ['TSRANGE']],
    [PostgresTypeID.TSTZRANGE, ['TSTZRANGE']],
    [PostgresTypeID.DATERANGE, ['DATERANGE']]
]);

/**
 * Map of PostgreSQL type names (including aliases) to their corresponding type IDs.
 * Provides O(1) lookup for all type names and aliases.
 */
export const PostgresTypeNameToID = new Map<string, number>([
    // Numeric Types
    ['SMALLINT', PostgresTypeID.SMALLINT],
    ['SMALLSERIAL', PostgresTypeID.SMALLINT],
    ['INTEGER', PostgresTypeID.INTEGER],
    ['SERIAL', PostgresTypeID.INTEGER],
    ['BIGINT', PostgresTypeID.BIGINT],
    ['BIGSERIAL', PostgresTypeID.BIGINT],
    ['DECIMAL', PostgresTypeID.DECIMAL],
    ['NUMERIC', PostgresTypeID.DECIMAL],
    ['REAL', PostgresTypeID.REAL],
    ['DOUBLE_PRECISION', PostgresTypeID.DOUBLE_PRECISION],
    ['MONEY', PostgresTypeID.MONEY],

    // Character Types
    ['CHAR', PostgresTypeID.CHAR],
    ['VARCHAR', PostgresTypeID.VARCHAR],
    ['TEXT', PostgresTypeID.TEXT],

    // Binary Types
    ['BYTEA', PostgresTypeID.BYTEA],

    // Date/Time Types
    ['DATE', PostgresTypeID.DATE],
    ['TIME', PostgresTypeID.TIME],
    ['TIME_WITH_TIMEZONE', PostgresTypeID.TIME_WITH_TIMEZONE],
    ['TIMESTAMP', PostgresTypeID.TIMESTAMP],
    ['TIMESTAMP_WITH_TIMEZONE', PostgresTypeID.TIMESTAMP_WITH_TIMEZONE],
    ['INTERVAL', PostgresTypeID.INTERVAL],

    // Boolean Type
    ['BOOLEAN', PostgresTypeID.BOOLEAN],

    // Geometric Types
    ['POINT', PostgresTypeID.POINT],
    ['LINE', PostgresTypeID.LINE],
    ['LSEG', PostgresTypeID.LSEG],
    ['BOX', PostgresTypeID.BOX],
    ['PATH', PostgresTypeID.PATH],
    ['POLYGON', PostgresTypeID.POLYGON],
    ['CIRCLE', PostgresTypeID.CIRCLE],

    // Network Address Types
    ['INET', PostgresTypeID.INET],
    ['CIDR', PostgresTypeID.CIDR],
    ['MACADDR', PostgresTypeID.MACADDR],
    ['MACADDR8', PostgresTypeID.MACADDR8],

    // Bit String Types
    ['BIT', PostgresTypeID.BIT],
    ['BIT_VARYING', PostgresTypeID.BIT_VARYING],

    // Text Search Types
    ['TSVECTOR', PostgresTypeID.TSVECTOR],
    ['TSQUERY', PostgresTypeID.TSQUERY],

    // UUID Type
    ['UUID', PostgresTypeID.UUID],

    // XML Type
    ['XML', PostgresTypeID.XML],

    // JSON Types
    ['JSON', PostgresTypeID.JSON],
    ['JSONB', PostgresTypeID.JSONB],

    // Array Types
    ['INTEGER_ARRAY', PostgresTypeID.INTEGER_ARRAY],
    ['TEXT_ARRAY', PostgresTypeID.TEXT_ARRAY],

    // Range Types
    ['INT4RANGE', PostgresTypeID.INT4RANGE],
    ['INT8RANGE', PostgresTypeID.INT8RANGE],
    ['NUMRANGE', PostgresTypeID.NUMRANGE],
    ['TSRANGE', PostgresTypeID.TSRANGE],
    ['TSTZRANGE', PostgresTypeID.TSTZRANGE],
    ['DATERANGE', PostgresTypeID.DATERANGE]
]);

/**
 * Checks if a given PostgreSQL type ID represents a numeric data type.
 * 
 * @param {number} typeID - PostgreSQL type ID to check
 * @returns {boolean} True if the type ID is a numeric type, false otherwise
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
