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
* Error thrown when an operation is attempted on an uninitialized execution engine.
* This error is thrown when an operation requires the engine to be initialized first.
*/
export class NotInitializedError extends Error {
    constructor(message?: string) {
        super(`Not initialized: ${message}`);
        this.name = "NotInitializedError";
    }
}

/**
* Represents the result of an execution operation.
* This is a generic interface that can be used across different execution contexts.
* 
* @template T - The type of data returned by the execution. Defaults to unknown.
*/
export interface ExecutionResult<T = unknown> {
    /**
     * Indicates whether the execution was successful.
     * True if the operation completed without errors, false otherwise.
     */
    success: boolean;
    
    /**
     * Optional error message if the execution failed.
     * Present only when success is false.
     */
    error?: string;
    
    /**
     * The data returned by the execution.
     * The structure depends on the generic type parameter T.
     */
    data: T;
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
     * Creates a new instance of the execution engine.
     * @param {unknown[]} _args - Optional arguments to configure the engine.
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async create(..._args: unknown[]): Promise<ExecutionEngine> {
        throw new Error("Method not implemented.");
    }
    /**
     * Executes a query or code snippet.
     * @param {string} code - The query or code to execute.
     * @returns {Promise<ExecutionResult>} - The result of the execution.
     */
    abstract execute(code: string): Promise<ExecutionResult>
    /**
     * Resets the execution engine to its initial state.
     * @returns {Promise<void>}
     */
    abstract reset(): Promise<void>
    /**
     * Destroys the execution engine and releases any resources.
     * @returns {Promise<void>}
     */
    abstract destroy(): Promise<void>
}