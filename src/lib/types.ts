/**
 * Core types and interfaces for SQL Hero, including challenge state management, PostgreSQL data structures, and query results.
 * 
 * This module defines the essential data structures used to represent challenges, attempts, and the global application state in SQL Hero.
 * It also includes types for PostgreSQL fields, query results, table comparisons, and utility types for managing actions and state transitions.
 * 
 * @module lib/types
 */

/**
 * Represents the data structure for an attempt, including timestamps, success status, and optional query.
 */
export interface AttemptData {
    /** Timestamp when the attempt began */
    startTime: Date;

    /** Timestamp when the attempt ended, if applicable */
    endTime?: Date;

    /** Duration of the attempt in milliseconds, if applicable */
    duration?: number;

    /** Indicates whether the attempt was successful */
    success: boolean;

    /** Query or code used during the attempt, if applicable */
    query?: string;
}

/**
 * Represents an attempt at performing an operation, such as a query or task.
 * Implements the `AttemptData` interface.
 */
export class Attempt implements AttemptData {
    startTime: Date;
    endTime?: Date | undefined;
    success: boolean;
    query?: string | undefined;

    /**
     * Creates a new Attempt instance.
     * 
     * @param startTime - The timestamp when the attempt started. Defaults to the current time if not provided.
     * @param success - Indicates whether the attempt was successful. Defaults to `false` if not provided.
     */
    constructor(startTime?: Date, success?: boolean) {
        this.startTime = startTime ?? new Date();
        this.success = success ?? false;
    }

    /**
     * Creates an `Attempt` instance from a plain object.
     * 
     * @param obj - A plain object containing properties for `startTime`, `endTime`, `success`, and `query`.
     * @returns An `AttemptData` object populated with the provided properties.
     */
    static fromObject(obj: Record<string, unknown>): AttemptData {
        const attempt = new Attempt(undefined, obj.success as boolean);
        attempt.startTime = new Date(obj.startTime as string ?? undefined);
        attempt.endTime = obj.endTime ? new Date(obj.endTime as string) : undefined;
        attempt.success = obj.success as boolean;
        attempt.query = obj.query as string;
        return attempt;
    }

    /**
     * Calculates the duration of the attempt in milliseconds.
     * 
     * @returns The duration in milliseconds if the attempt has ended and the duration is valid; otherwise, `undefined`.
     */
    get duration(): number | undefined {
        const duration = (this.endTime?.getTime() ?? 0) - this.startTime.getTime();
        return duration > 0 ? duration : undefined;
    }
}

/**
 * Represents the structure of a challenge, typically used in coding or database-related challenges.
 * 
 * This interface defines the properties required to describe a challenge, including its metadata, 
 * schema, and expected results.
 * 
 * @interface ChallengeData
 */
export interface ChallengeData {
    /**
     * @property {number} number
     * @description A unique identifier or sequence number for the challenge.
     * @example 1
     */
    number: number;

    /**
     * @property {string} title
     * @description The title or name of the challenge.
     * @example "Find the highest salary"
     */
    title: string;

    /**
     * @property {string} schema
     * @description The schema or structure of the database/table(s) relevant to the challenge.
     * This is typically a SQL schema or a JSON representation of the data structure.
     * @example "CREATE TABLE employees (id INT, name TEXT, salary INT);"
     */
    schema: string;

    /**
     * @property {string} description
     * @description A detailed description of the challenge, including the problem statement and requirements.
     * @example "Write a query to find the employee with the highest salary."
     */
    description: string;

    /**
     * @property {'easy' | 'medium' | 'hard'} difficulty
     * @description The difficulty level of the challenge.
     * Possible values: 'easy', 'medium', 'hard'.
     * @example "medium"
     */
    difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
    /**
     * @property {string} query
     * @description The query or solution to the challenge. This is typically a SQL query or code snippet.
     * @example "SELECT name, MAX(salary) FROM employees;"
     */
    query: string;
    /**
     * @property {string} hashedResult
     * @description A hashed representation of the expected result of the challenge.
     * This is used to verify the correctness of the user's solution.
     * @example "a1b2c3d4e5f6g7h8i9j0"
     */
    hashedResult: string;
    /**
     * @property {string[]} hints
     * @description An array of hints to assist the user in solving the challenge.
     * Each hint is a string that provides guidance or clues.
     * @example ["Use the MAX() function", "Filter by salary"]
     */
    hints: string[];
    /**
     * @property {string} [erd]
     * @description Optional property representing an Entity-Relationship Diagram (ERD) for the challenge.
     * This is typically a URL or base64-encoded image of the ERD.
     * @example "https://example.com/erd.png"
     */
    erd?: string;
};

/**
 * Represents the structure of a challenge, including its metadata, status, and attempts.
 * Provides methods to track and manage user attempts on the challenge.
 */
export interface IChallenge {
    /** Position of the challenge */
    number: number;

    /** Display name of the challenge */
    title: string;

    /** Indicates whether the challenge has been successfully completed */
    completed: boolean;

    /** Indicates whether the challenge has been attempted at least once */
    attempted: boolean;

    /** Indicates whether the most recent attempt on the challenge failed */
    failed: boolean;

    /** Array of attempts made on the challenge */
    attempts: Attempt[];

    /** Timestamp of the last attempt, if applicable */
    lastAttempt?: Date;

    /** Total duration of all attempts in milliseconds, if applicable */
    totalDuration?: number;

    /** Difference between expected and actual results, if applicable */
    difference?: TableDiff;

    /** Difficulty level of the challenge */
    difficulty: 'easy' | 'medium' | 'hard' | 'unknown';

    /** Schema or structure of the database/table(s) relevant to the challenge */
    schema: string;

    /**
     * Starts a new attempt on the challenge.
     * @sideeffects
     * - Adds a new attempt object to the challenge's attempt history.
     * - Sets the start time to the current date and time.
     * - Marks the attempt as unsuccessful.
     */
    startAttempt(): void;

    /**
     * Ends the current attempt on the challenge.
     * @param success - Indicates whether the attempt was successful
     * @param query - Optional query or code used during the attempt
     * @sideeffects
     * - Updates the most recent attempt with end time, duration, success status, and query.
     * - Marks the challenge as completed if successful, otherwise marks it as failed.
     */
    endAttempt(success: boolean, query?: string): void;
}



/**
 * Implementation of the `ChallengeData` interface with additional static factory methods
 * for creating challenges from different data sources.
 */
export class Challenge implements IChallenge, ChallengeData {
    number: number;
    title: string;
    completed: boolean;
    attempted: boolean;
    failed: boolean;
    totalDurartion?: number | undefined;
    difference?: TableDiff | undefined;
    difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
    attempts: Attempt[];
    schema: string;
    description: string;
    query: string;
    hashedResult: string;
    hints: string[];
    erd?: string | undefined;

    /**
     * Creates a new challenge instance.
     * 
     * @param number - Unique identifier for the challenge.
     * @param title - Display name of the challenge.
     */
    constructor(number: number, title: string) {
        this.number = number;
        this.title = title;
        this.completed = false;
        this.attempted = false;
        this.failed = false;
        this.attempts = [];
        this.difficulty = 'unknown';
        this.schema = '';
        this.description = '';
        this.query = '';
        this.hashedResult = '';
        this.hints = [];
    }


    /**
     * Creates a `Challenge` instance from a `ShortChallenge` object.
     * 
     * @param shortChallenge - Simplified challenge object containing basic information.
     * @returns A new `Challenge` instance with default status values.
     */
    static fromShortChallenge(shortChallenge: ShortChallenge): Challenge {
        const challenge = new Challenge(shortChallenge.number, shortChallenge.title);
        challenge.difficulty = shortChallenge.difficulty;
        challenge.schema = shortChallenge.schema;
        return challenge;
    }

    /**
     * Creates a `Challenge` instance from a generic object, typically from deserialized JSON.
     * 
     * @param obj - Record containing challenge properties.
     * @returns A fully populated `Challenge` instance with all available properties.
     */
    static fromObject(obj: Record<string, unknown>): Challenge {
        const challenge = new Challenge(obj.number as number, obj.title as string);
        challenge.completed = obj.completed as boolean;
        challenge.attempted = obj.attempted as boolean;
        challenge.failed = obj.failed as boolean;
        challenge.difference = obj.difference as TableDiff;
        challenge.difficulty = obj.difficulty as 'easy' | 'medium' | 'hard';
        challenge.schema = obj.schema as string;
        challenge.attempts = (obj.attempts as Record<string, unknown>[]).map(Attempt.fromObject) as Attempt[];
        return challenge;
    }

    /**
     * Starts a new attempt on the challenge.
     * 
     * @sideeffects 
     * - Adds a new attempt object to the challenge's attempt history.
     * - Sets the start time to the current date and time.
     * - Marks the attempt as unsuccessful.
     */
    startAttempt(): void {
        this.attempted = true;
        this.attempts.push(new Attempt());
    }

    /**
     * Ends the current attempt on the challenge.
     * 
     * @param success - Indicates whether the attempt was successful.
     * @param query - Optional query string used in the attempt.
     * 
     * @sideeffects 
     * - Updates the most recent attempt object with the end time, duration, success status, and query string if provided.
     * - If the attempt was successful, marks the challenge as completed; otherwise, marks it as failed.
     */
    endAttempt(success: boolean, query?: string): void {
        if (this.attempts.length > 0) {
            const current = this.attempts[this.attempts.length - 1];
            current.endTime = new Date();
            current.query = query;
            current.success = success;

            if (success) {
                this.completed = true;
                this.failed = false;
            } else {
                this.failed = true;
            }
        }
    }

    /**
     * Retrieves the total duration of all attempts on the challenge.
     * 
     * @readonly
     * @returns The total duration of all attempts in milliseconds.
     */
    get totalDuration(): number {
        const firstSuccessIndex = this.attempts.findIndex(attempt => attempt.success);
        return (
            firstSuccessIndex === -1
                ? this.attempts
                : this.attempts.slice(0, firstSuccessIndex + 1)
        ).reduce((total, attempt) => total + (attempt.duration || 0), 0);
    }

    /**
     * Retrieves the duration of the last attempt on the challenge, if available.
     * 
     * @readonly
     * @returns The duration of the most recent attempt in milliseconds or `undefined` if no attempts have been made.
     */
    get lastAttempt(): Date | undefined {
        return this.attempts.length > 0 ? this.attempts[this.attempts.length - 1].startTime : undefined;
    }
}

/**
 * Global application state interface.
 * Contains challenges data and UI-related state.
 */
export interface AppState {
    /** Map of challenge IDs to Challenge objects */
    challenges: Challenge[];

    /** Reference to header DOM element for scroll animations */
    headerElement: HTMLHeadingElement | null;

    /** ID of the currently active challenge, if any */
    currentChallenge?: Challenge;
}

/**
 * Represents the result of comparing two query results.
 */
export type ResultComparison = {
    /** Array of column names */
    columns: string[];

    /** 2D array of stringified values */
    rows: string[][];
};

/**
 * Represents a short version of a challenge with only essential information.
 * Used for generating challenge lists.
 */
export interface ShortChallenge {
    /** Challenge number */
    number: number;

    /** Challenge title */
    title: string;

    /** Challenge difficulty level */
    difficulty: 'easy' | 'medium' | 'hard';

    /** Schema or structure of the database/table(s) relevant to the challenge */
    schema: string;

    /** Optional ERD (Entity-Relationship Diagram) for the challenge */
    erd?: string;
}

/**
 * Union type defining all possible actions that can modify the app state.
 * Each action has a specific type identifier and associated payload data.
 */
export type ChallengeAction =
    /** Starts a new attempt on a challenge */
    | { type: 'INIT_CHALLENGE'; payload: { index: number } }

    /** Marks a challenge as completed */
    | { type: 'COMPLETE_CHALLENGE'; payload: { index: number, query: string } }

    /** Records an attempt on a challenge */
    | { type: 'ATTEMPT_CHALLENGE'; payload: { index: number } }

    /** Marks a challenge attempt as failed */
    | { type: 'CHALLENGE_FAILED', payload: { index: number, difference: TableDiff, query: string } }

    /** Updates the header element reference */
    | { type: 'SET_HEADER_REF'; payload: HTMLHeadingElement }

    /** Sets the currently active challenge */
    | { type: 'SET_CURRENT_CHALLENGE'; payload: Challenge }

    /** Initializes the challenges list */
    | { type: 'INIT_CHALLENGES'; payload: Challenge[] }

    /** Loads the application state from a saved state object */
    | { type: 'LOAD_STATE'; payload: null };

/**
 * Enumeration of PostgreSQL data type Object Identifiers (OIDs).
 * These values represent the internal type identifiers used by PostgreSQL to uniquely identify data types.
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
 */
export interface TableDiff {
    /** Array of column names missing in the received table */
    missingColumns: string[];

    /** Array of column names present in the received table but not in the expected table */
    extraColumns: string[];

    /** Array of mismatched rows */
    mismatchedRows: Array<{
        /** Index of the mismatched row */
        rowIndex: number;

        /** Array of column differences */
        differences: Array<{
            /** Name of the column */
            column: string;

            /** Expected value */
            expected: string;

            /** Received value */
            received: string;
        }>;
    }>;
}

/**
 * Enum representing SQL statement types.
 * 
 * This enum categorizes SQL statements into their standard classification groups,
 * providing human-readable values for each category.
 * 
 * @enum {string}
 */
export enum StatementType {
    /** 
     * Data Definition Language - statements that define database structures
     * (e.g., CREATE, ALTER, DROP)
     */
    DDL = 'DataDefinitionLanguage',
    
    /** 
     * Data Manipulation Language - statements that manipulate data within tables
     * (e.g., SELECT, INSERT, UPDATE, DELETE)
     */
    DML = 'DataManipulationLanguage',
    
    /** 
     * Data Control Language - statements that control access permissions
     * (e.g., GRANT, REVOKE)
     */
    DCL = 'DataControlLanguage',
    
    /** 
     * Transaction Control Language - statements that manage transactions
     * (e.g., BEGIN, COMMIT, ROLLBACK)
     */
    TCL = 'TransactionControlLanguage',
}

/**
 * Enumaration of panel types used in the application.
 * 
 * This enum defines the different types of panels that can be displayed in the application,
 * including lesson content, code editor, ERD (Entity-Relationship Diagram), and query results.
 */
export enum PanelTypes {
    LESSON = 'lessonPanel',
    EDITOR = 'editorPanel',
    ERD = 'erdPanel',
    RESULT = 'resultPanel',
    GROUP = 'groupPanel',
}