/**
 * PostgreSQL Execution Engine Module
 * 
 * This module provides a PostgreSQL-specific implementation of the ExecutionEngine interface.
 * It handles SQL query execution, transaction management, and result processing using the
 * PGlite library for in-memory PostgreSQL database operations.
 * 
 * The module enables executing SQL queries, managing transactions with automatic rollback,
 * and proper error handling for SQL operations.
 * 
 * @module lib/exec-engine/postgres-engine
 */

import { PGlite, Transaction } from "@electric-sql/pglite";
import { ExecutionEngine, ExecutionResult } from "./execution-engine";

/**
 * Error thrown when operations are attempted on an uninitialized PostgreSQL engine.
 */
class NotInitializedError extends Error {
    constructor() {
        super("PostgresExecutionEngine not initialized");
    }
}

/**
 * Represents the field structure of a PostgreSQL table.
 */
export interface PgField {
    /** Name of the field */
    name: string;

    /** Data type ID of the field */
    dataTypeID: number;
}

/**
 * Represents the result of a PostgreSQL query execution.
 * Contains the field metadata and row data.
 */
export interface QueryResult {
    /** Metadata for each column in the result */
    fields: PgField[];

    /** Row data from the query result */
    rows: PgCell[];
}

/**
 * Represents a single cell value in a PostgreSQL table.
 * Values are stored as key-value pairs where the key is the column name.
 */
export type PgCell = Record<string, unknown>;

/**
 * Extends the base ExecutionResult interface with PostgreSQL-specific data structure.
 */
export interface SqlExecutionResult extends ExecutionResult {
    /** Array of query results or null if execution failed */
    data: QueryResult[] | null;
}

/**
 * PostgreSQL implementation of the ExecutionEngine interface.
 * 
 * This class provides functionality to execute SQL statements against an in-memory
 * PostgreSQL database using the PGlite library. It supports batched statement execution
 * within transactions and automatic rollback for data safety.
 */
export class PostgresExecutionEngine extends ExecutionEngine {
    /** The PGlite instance for database operations */
    private pg?: PGlite;

    /** Collection of SQL statements to be executed in batch */
    private statements: string[];

    /**
     * Private constructor to enforce creation through factory method.
     */
    private constructor() {
        super();
        this.pg = undefined;
        this.statements = [];
    }

    /**
     * Initializes the PostgreSQL engine with the provided schema.
     * 
     * @param schema - SQL schema definition to initialize the database
     * @returns Promise that resolves when initialization is complete
     */
    async initialize(schema: string): Promise<void> {
        this.pg = await PGlite.create();
        await this.pg.exec(schema);
    }

    /**
     * Factory method to create and initialize a new PostgresExecutionEngine instance.
     * 
     * @param schema - SQL schema definition to initialize the database
     * @returns Promise that resolves to an initialized PostgresExecutionEngine
     * 
     * @example
     * const engine = await PostgresExecutionEngine.create(`
     *   CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);
     *   INSERT INTO users (name) VALUES ('Alice'), ('Bob');
     * `);
     */
    static async create(schema: string): Promise<PostgresExecutionEngine> {
        const engine = new PostgresExecutionEngine();
        await engine.initialize(schema);
        return engine;
    }

    /**
     * Executes one or more SQL statements and returns the results.
     * Statements are executed in a transaction that is automatically rolled back
     * after execution to prevent persistent changes.
     * 
     * @param code - One or more SQL statements separated by semicolons
     * @returns Promise resolving to execution results with query data or error information
     * 
     * @example
     * const result = await engine.execute("SELECT * FROM users; UPDATE users SET name = 'Charlie' WHERE id = 1;");
     * if (result.success) {
     *   console.log(result.data[0].rows); // First query results
     *   console.log(result.data[1].rows); // Second query results
     * }
     * 
     * @throws NotInitializedError if the engine hasn't been initialized
     */
    async execute(code: string): Promise<SqlExecutionResult> {
        if (!this.pg) {
            throw new NotInitializedError();
        }

        try {
            this.statements = code.split(';').map(s => s.trim()).filter(Boolean);
            const result = await this.pg.transaction<QueryResult[]>(this.batchExecution.bind(this));
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            const msg = error instanceof Error
                ? error.message
                : String(error);

            return {
                success: false,
                error: msg,
                data: null,
            };
        }
    }

    /**
     * Internal method to execute all batched statements within a transaction.
     * 
     * @param transaction - The transaction object provided by PGlite
     * @returns Promise resolving to an array of query results
     */
    private async batchExecution(transaction: Transaction): Promise<QueryResult[]> {
        const result = await Promise.all(this.statements.map(
            async (stmt) => (await transaction.query(stmt)) as QueryResult)
        );

        transaction.rollback();
        this.statements = [];

        return result;
    }

    /**
     * Resets the execution engine by rolling back any active transactions.
     * 
     * @returns Promise that resolves when the reset is complete
     * @throws NotInitializedError if the engine hasn't been initialized
     */
    async reset(): Promise<void> {
        if (!this.pg) {
            throw new NotInitializedError();
        }

        await this.pg.exec("ROLLBACK;");
    }
}