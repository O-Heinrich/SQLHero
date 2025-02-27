/**
* Types and interfaces for the challenge application state management.
* 
* @description  This module defines the data structures used to represent challenges and the global application state.
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
    number: number;

    /** Display title of the challenge */
    title: string;

    /** Whether the challenge has been successfully completed */
    completed?: boolean;

    /** Whether the challenge has been attempted at least once */
    attempted?: boolean;

    /** Whether the most recent attempt on the challenge has failed */
    failed?: boolean;

    /** Timestamp of the most recent attempt, if any */
    lastAttempt?: Date;

    /** Table diff object if the challenge attempt failed */
    difference?: TableDiff;
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
 * Represents the result of comparing two query results.
 * @interface
 * @property {string[]} columns - Array of column names
 * @property {string[][]} rows - 2D array of stringified values
 */
export type ResultComparison = {
    columns: string[];
    rows: string[][];
};

/**
 * Represents a short version of a challenge with only essential information.
 * Used for generating challenge lists.
 * @interface
 * @property {number} number - Challenge number
 * @property {string} title - Challenge title
 * @property {'easy' | 'medium' | 'hard'} difficulty - Challenge difficulty level
 */
export interface ShortChallenge {
    number: number;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    schema: string;
    erd?: string;
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

    /** Marks a challenge attempt as failed */
    | { type: 'CHALLENGE_FAILED', payload: { id: string, difference: TableDiff } }

    /** Updates the header element reference */
    | { type: 'SET_HEADER_REF'; payload: HTMLHeadingElement }

    /** Sets the currently active challenge */
    | { type: 'SET_CURRENT_CHALLENGE'; payload: string }

    /** Initializes the challenges list */
    | { type: 'INIT_CHALLENGES'; payload: Challenge[] };

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
 * Represents the difference between two PostgreSQL tables.
 * @interface
 * @property {string[]} missingColumns - Array of column names missing in the received table
 * @property {string[]} extraColumns - Array of column names present in the received table but not in the expected table
 * @property {Array<{ 
 *      rowIndex: number, 
 *      differences: Array<{ 
 *          column: string, 
 *          expected: string, 
 *          received: string 
 *      }> 
 * }>} mismatchedRows - Array of mismatched rows
 */
export interface TableDiff {
    missingColumns: string[];
    extraColumns: string[];
    mismatchedRows: Array<{
        rowIndex: number;
        differences: Array<{
            column: string;
            expected: string;
            received: string;
        }>;
    }>;
}