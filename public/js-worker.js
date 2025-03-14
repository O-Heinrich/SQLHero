// Handle messages from the main thread
self.onmessage = async function (e) {
    const { code, timeout, environment, testMode } = e.data;

    try {
        // Set up execution context with provided environment
        const globals = environment?.globals || {};
        const modules = environment?.modules || {};
        const testUtils = environment?.testUtils || {};

        // Create execution context
        const contextSetup = Object.entries(globals)
            .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
            .join('n');

        // Add test utilities if in test mode
        // const testSetup = testMode ?
        //     `const { test, assert } = TestFramework;
        //         ${Object.entries(testUtils)
        //         .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
        //         .join('n')}` : '';

        // Wrap code execution with timeout
        let executeCode;
        if (testMode) {
            executeCode = `
                ${contextSetup}
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
                    test: function (name, fn) {
                        this.tests.push({ name, fn });
                    },

                    // Assert functions
                    assert: {
                        equal: function (actual, expected, message) {
                            if (actual !== expected) {
                                throw new Error(message || \`Expected \${JSON.stringify(expected)}, but got \${JSON.stringify(actual)}\`);
                            }
                        },
                        notEqual: function (actual, expected, message) {
                            if (actual === expected) {
                                throw new Error(message || \`Expected \${JSON.stringify(actual)} to be different from \${JSON.stringify(expected)}\`);
                            }
                        },
                        true: function (value, message) {
                            if (value !== true) {
                                throw new Error(message || \`Expected true, but got \${JSON.stringify(value)}\`);
                            }
                        },
                        false: function (value, message) {
                            if (value !== false) {
                                throw new Error(message || \`Expected false, but got \${JSON.stringify(value)}\`);
                            }
                        },
                        throws: function (fn, message) {
                            try {
                                fn();
                                throw new Error(message || 'Expected function to throw an error, but it did not');
                            } catch (e) {
                                // Expected behavior
                            }
                        }
                    },

                    // Run all registered tests
                    runTests: function () {
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
                
                // Execute the provided code
                ${code}
                
                // Run tests and return results
                return TestFramework.runTests();
            `;
        } else {
            executeCode = `
                ${contextSetup}
                
                // Execute the provided code
                (function() {
                    ${code}
                })();
            `;
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