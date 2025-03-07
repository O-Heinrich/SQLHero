/**
 * This is an example of how to use the JavaScriptExecutionEngine class to run tests.
 * 
 * @note Just copy and paste this code to main.tsx and watch the dev console.
 * 
 */
import { JavaScriptExecutionEngine } from "../src/lib/exec-engine/javascript-engine";
import { PostgresExecutionEngine } from "../src/lib/exec-engine/postgres-engine";

async function jsEngine(): Promise<void> {
    const engine = await JavaScriptExecutionEngine.create();

    // Execute a simple JavaScript code snippet. Like PgExecutionEngine supports, too.
    await engine.execute('console.log("Hello, World!\n\n")');

    // But additionally JavaScriptExecutionEngine supports running tests.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await engine.runTests(`
        const { assert } = TestFramework;
        const sum = (a, b) => a + b;

        TestFramework.test('adds 1 + 2 to equal 3', () => {
            assert.equal(sum(1, 2), 3, '1 + 2 should be 3');
        });

        TestFramework.test('adds 2 + 2 to equal 4', () => {
            assert.equal(sum(2, 2), 4, '2 + 2 should be 4');
        });

        TestFramework.test('adds 3 + 2 to equal 5', () => {
            assert.equal(sum(3, 2), 5, '3 + 2 should be 5');
        });

        TestFramework.test('adds 4 + 2 to equal 6', () => {
            assert.equal(sum(4, 2), 6, '4 + 2 should be 6');
        });

        TestFramework.test('adds 5 + 2 to equal 7', () => {
            assert.equal(sum(5, 2), 7, '5 + 2 should be 7');
        });
    `);

    console.log('Test running ' + (result.success ? 'was successful' : 'failed'));
    console.log(`Total tests: ${result.testResults?.total}`);
    console.log(`Passed tests: ${result.testResults?.passed}`);
    console.log(`Failed tests: ${result.testResults?.failed}`);
    console.log(`\n        ======== Test Results ========\n` + result.testResults?.details.map((r: {name: string, passed: boolean, error: string}) => 
        `        ${r.name} - ${r.passed ? 'Passed' : 'Failed'} ${r.error ? r.error : ''}`
    ).join('\n'));

    engine.destroy();
}

async function pgEngine(): Promise<void> {
    // The interface remains the same, but the engine is now a PostgresExecutionEngine
    const engine = await PostgresExecutionEngine.create(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name TEXT
        );

        INSERT INTO users (name) VALUES ('Alice'), ('Bob');
    `);

    const result = await engine.execute('SELECT * FROM users;');

    engine.destroy();

    if (!result.success) {
        console.error(result.error);
        return;
    }

    console.table(result.data[0].rows);
    
}

jsEngine().then(() => console.log('        ==============================\n')).catch(console.error);
pgEngine().catch(console.error);