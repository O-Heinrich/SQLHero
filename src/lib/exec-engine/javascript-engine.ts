/**
 * Enhanced JavaScript Execution Engine Module
 * 
 * This module provides a JavaScript-specific implementation of the ExecutionEngine interface
 * with support for arbitrary JavaScript execution, environment configuration, and unit testing.
 * 
 * @module lib/exec-engine/javascript-engine
 */

import { ExecutionEngine, ExecutionResult, NotInitializedError } from "./execution-engine";

/**
 * Represents the environment configuration for JavaScript execution.
 */
export interface JavaScriptEnvironment {
    /** Global variables to be included in the execution context */
    globals?: Record<string, unknown>;
    /** Test utilities and libraries to be injected */
    testUtils?: Record<string, unknown>;
    /** External modules to be made available */
    modules?: Record<string, unknown>;
}

/**
 * Represents the options for JavaScript code execution.
 */
export interface ExecutionOptions {
    /** Timeout for code execution in milliseconds */
    timeout?: number;
    /** Environment configuration for this execution */
    environment?: JavaScriptEnvironment;
    /** Whether to run in test mode, which includes extra utilities */
    testMode?: boolean;
}

export interface TestResult {
    /** Total number of tests run */
    total: number;
    /** Number of passing tests */
    passed: number;
    /** Number of failing tests */
    failed: number;
    /** Detailed results for each test */
    details: Array<{
        /** Test name or description */
        name: string;
        /** Whether the test passed */
        passed: boolean;
        /** Error message if the test failed */
        error?: string;
    }>;
}

/**
 * Represents the result of a JavaScript code execution operation.
 * This is a specialized version of the ExecutionResult interface for JavaScript code.
 * It includes additional test results if executed in test mode.
 * 
 * @template T - The type of data returned by the execution. Defaults to unknown.
 */
export interface JavaScriptExecutionResult<T> extends ExecutionResult<T> {
    /** Optional test results if executed in test mode */
    testResults?: TestResult[];
}

/**
 * JavaScript implementation of the ExecutionEngine interface with testing capabilities.
 * 
 * This class provides functionality to execute JavaScript code in a web worker,
 * with support for timeouts, environment configuration, and unit testing.
 */
export class JavaScriptExecutionEngine extends ExecutionEngine {
    /** The Web Worker instance for code execution */
    private worker?: Worker;
    /** Default timeout for code execution in milliseconds */
    private defaultTimeout: number;
    /** Default environment configuration */
    private defaultEnvironment: JavaScriptEnvironment;

    /**
     * Private constructor to enforce creation through factory method.
     * 
     * @param defaultTimeout - Default timeout for code execution in milliseconds
     * @param defaultEnvironment - Default environment configuration
     */
    private constructor(
        defaultTimeout: number = 5000,
        defaultEnvironment: JavaScriptEnvironment = {}
    ) {
        super();
        this.defaultTimeout = defaultTimeout;
        this.defaultEnvironment = defaultEnvironment;
        this.worker = undefined;
    }

    /**
     * Initializes the JavaScript engine by creating a new web worker with the test environment.
     */
    private initialize(): void {
        // Define the worker script with enhanced testing capabilities
        const workerScript = `
            // Simple test framework implementation
            const TestFramework = {
                tests: [],
                results: {
                    total: 0,
                    passed: 0,
                    failed: 0,
                    details: []
                },
                
                // Register a test
                test: function(name, fn) {
                    TestFramework.tests.push({ name, fn });
                },
                
                // Assert functions
                assert: {
                    equal: function(actual, expected, message) {
                        if (actual !== expected) {
                            throw new Error(message || \`Expected \${JSON.stringify(expected)}, but got \${JSON.stringify(actual)}\`);
                        }
                    },
                    notEqual: function(actual, expected, message) {
                        if (actual === expected) {
                            throw new Error(message || \`Expected \${JSON.stringify(actual)} to be different from \${JSON.stringify(expected)}\`);
                        }
                    },
                    true: function(value, message) {
                        if (value !== true) {
                            throw new Error(message || \`Expected true, but got \${JSON.stringify(value)}\`);
                        }
                    },
                    false: function(value, message) {
                        if (value !== false) {
                            throw new Error(message || \`Expected false, but got \${JSON.stringify(value)}\`);
                        }
                    },
                    throws: function(fn, message) {
                        try {
                            fn();
                            throw new Error(message || 'Expected function to throw an error, but it did not');
                        } catch (e) {
                            // Expected behavior
                        }
                    }
                },
                
                // Run all registered tests
                runTests: function() {
                    this.results.total = TestFramework.tests.length;
                    this.results.passed = 0;
                    this.results.failed = 0;
                    this.results.details = [];
                    
                    for (const test of TestFramework.tests) {
                        try {
                            test.fn();
                            this.results.passed++;
                            this.results.details.push({
                                name: test.name,
                                passed: true
                            });
                        } catch (error) {
                            this.results.failed++;
                            this.results.details.push({
                                name: test.name,
                                passed: false,
                                error: error.message
                            });
                        }
                    }
                    
                    return this.results;
                }
            };

            // Handle messages from the main thread
            self.onmessage = async function(e) {
                const { code, timeout, environment, testMode } = e.data;
                
                try {
                    // Set up execution context with provided environment
                    const globals = environment?.globals || {};
                    const modules = environment?.modules || {};
                    const testUtils = environment?.testUtils || {};
                    
                    // Create execution context
                    const contextSetup = Object.entries(globals)
                        .map(([key, value]) => \`const \${key} = \${JSON.stringify(value)};\`)
                        .join('\\n');
                    
                    // Add test utilities if in test mode
                    const testSetup = testMode ? 
                        \`const { test, assert } = TestFramework;
                         \${Object.entries(testUtils)
                            .map(([key, value]) => \`const \${key} = \${JSON.stringify(value)};\`)
                            .join('\\n')}\` : '';
                    
                    // Wrap code execution with timeout
                    let executeCode;
                    if (testMode) {
                        executeCode = \`
                            \${contextSetup}
                            \${testSetup}
                            
                            // Execute the provided code
                            \${code}
                            
                            // Run tests and return results
                            return TestFramework.runTests();
                        \`;
                    } else {
                        executeCode = \`
                            \${contextSetup}
                            
                            // Execute the provided code
                            (function() {
                                \${code}
                            })();
                        \`;
                    }
                    
                    // Execute with timeout if specified
                    let result;
                    if (timeout) {
                        result = await Promise.race([
                            new Function(executeCode)(),
                            new Promise((_, reject) => 
                                setTimeout(() => reject(new Error('Execution timeout')), timeout)
                            )
                        ]);
                    } else {
                        const exec = new Function(executeCode);
                        result = exec();
                    }
                    
                    // Send successful result back
                    if (testMode && result) {
                        self.postMessage({ 
                            success: true, 
                            result: null,
                            testResults: result
                        });
                    } else {
                        self.postMessage({ 
                            success: true, 
                            result: result
                        });
                    }
                } catch (error) {
                    self.postMessage({ 
                        success: false, 
                        error: error.message 
                    });
                }
            };
        `;
        
        // Create the worker
        this.worker = new Worker(
            URL.createObjectURL(
                new Blob([workerScript], { type: "text/javascript" })
            )
        );
    }

    /**
     * Factory method to create and initialize a new JavaScriptExecutionEngine instance.
     * 
     * @param options - Configuration options for the engine
     * @returns Promise that resolves to an initialized JavaScriptExecutionEngine
     * 
     * @example
     * const engine = await JavaScriptExecutionEngine.create({
     *   defaultTimeout: 10000,
     *   defaultEnvironment: {
     *     globals: { API_URL: 'https://api.example.com' }
     *   }
     * });
     */
    static async create(options?: {
        defaultTimeout?: number;
        defaultEnvironment?: JavaScriptEnvironment;
    }): Promise<JavaScriptExecutionEngine> {
        const engine = new JavaScriptExecutionEngine(
            options?.defaultTimeout,
            options?.defaultEnvironment
        );
        engine.initialize();
        return engine;
    }

    /**
     * Executes JavaScript code in the web worker and returns the result.
     * 
     * @template T - The type of data returned by the execution
     * @param code - JavaScript code to execute
     * @param options - Optional execution options
     * @returns Promise resolving to execution results
     * 
     * @example
     * // Regular execution
     * const result = await engine.execute("const sum = (a, b) => a + b; return sum(5, 7);");
     * 
     * // Execution with tests
     * const testResult = await engine.execute(`
     *   function sum(a, b) { return a + b; }
     *   
     *   test('sum adds two numbers correctly', () => {
     *     assert.equal(sum(2, 3), 5);
     *     assert.equal(sum(-1, 1), 0);
     *   });
     * `, { testMode: true });
     * 
     * @throws NotInitializedError if the engine hasn't been initialized
     */
    async execute<T>(code: string, options?: ExecutionOptions): Promise<JavaScriptExecutionResult<T>> {
        if (!this.worker) {
            throw new NotInitializedError(JavaScriptExecutionEngine.name);
        }

        return new Promise((resolve) => {
            const effectiveTimeout = options?.timeout ?? this.defaultTimeout;
            const environment = {
                ...this.defaultEnvironment,
                ...(options?.environment || {})
            };
            const testMode = options?.testMode || false;
            
            const handleMessage = (event: MessageEvent) => {
                this.worker!.removeEventListener('message', handleMessage);
                
                if (event.data.success) {
                    resolve({
                        success: true,
                        data: event.data.result,
                        testResults: event.data.testResults
                    });
                } else {
                    resolve({
                        success: false,
                        error: event.data.error,
                        testResults: event.data.testResults,
                        data: {} as T
                    });
                }
            };

            this.worker!.addEventListener('message', handleMessage);
            this.worker!.postMessage({ 
                code, 
                timeout: effectiveTimeout,
                environment,
                testMode
            });
        });
    }

    /**
     * Executes JavaScript code in test mode with the built-in test framework.
     * 
     * @param code - JavaScript code with test definitions
     * @param options - Optional execution options (testMode will be set to true)
     * @returns Promise resolving to execution results with test outcomes
     * 
     * @example
     * const testResult = await engine.runTests(`
     *   function multiply(a, b) { return a * b; }
     *   
     *   test('multiply works with positive numbers', () => {
     *     assert.equal(multiply(2, 3), 6);
     *   });
     *   
     *   test('multiply works with negative numbers', () => {
     *     assert.equal(multiply(-2, 3), -6);
     *   });
     * `);
     */
    async runTests<T>(code: string, options?: Omit<ExecutionOptions, 'testMode'>): Promise<JavaScriptExecutionResult<T>> {
        return this.execute<T>(code, {
            ...options,
            testMode: true
        });
    }

    /**
     * Resets the execution engine by terminating the current worker and creating a new one.
     * 
     * @returns Promise that resolves when the reset is complete
     */
    async reset(): Promise<void> {
        await this.destroy();
        this.initialize();
    }

    /**
     * Destroys the execution engine and terminates the web worker.
     * 
     * @returns Promise that resolves when the engine is destroyed
     * @throws NotInitializedError if the engine hasn't been initialized
     */
    async destroy(): Promise<void> {
        if (!this.worker) {
            throw new NotInitializedError(JavaScriptExecutionEngine.name);
        }

        this.worker.terminate();
        this.worker = undefined;
    }

    /**
     * Evaluates whether the engine has been initialized.
     * 
     * @returns True if the engine is initialized, false otherwise
     */
    isInitialized(): boolean {
        return Boolean(this.worker);
    }
}