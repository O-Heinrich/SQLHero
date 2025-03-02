/**
* Core execution interfaces module.
* 
* This module provides the foundational interfaces for execution engines and their results.
* It defines the contract between the execution engine implementers and the consumers of
* execution functionality. These interfaces can be extended by specific execution engines
* like SQL, JavaScript, or other language processors.
* 
* @module lib/exec-engine/execution-engine
*/

/**
* Represents the result of an execution.
* This is a base interface that can be extended by specific execution engines.
*/
export interface ExecutionResult {
    /**
     * Indicates whether the execution was successful.
     */
    success: boolean;

    /**
     * Optional error message if the execution failed.
     */
    error?: string;

    /**
     * Implementation-specific data.
     * For example, SQL engines might return rows and columns, while JavaScript engines might return a single value.
     */
    data: unknown;
}

/**
* Abstract interface for execution engines.
*/
export abstract class ExecutionEngine {
    /**
     * Protected constructor to prevent direct instantiation.
     */
    protected constructor() { }
    /**
     * Executes a query or code snippet.
     * @param {string} code - The query or code to execute.
     * @returns {Promise<ExecutionResult>} - The result of the execution.
     */
    abstract execute(code: string): Promise<ExecutionResult>
    /**
     * Initializes the execution engine (e.g., loads a database schema).
     * @param {unknown} data - Optional data to initialize the engine.
     * @returns {Promise<void>}
     */
    abstract initialize(data?: string): Promise<void>
    /**
     * Resets the execution engine to its initial state.
     * @returns {Promise<void>}
     */
    abstract reset(): Promise<void>
    /**
     * Creates a new instance of the execution engine.
     * @param {unknown[]} _args - Optional arguments to configure the engine.
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async create(..._args: unknown[]): Promise<ExecutionEngine> {
        throw new Error("Method not implemented.");
    }
}