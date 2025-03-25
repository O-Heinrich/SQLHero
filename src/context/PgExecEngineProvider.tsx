import { ReactNode,  useState } from "react";
import { PgExecEngineContext } from "./PgExecEngineContext";
import { PostgresExecutionEngine } from "@/lib/exec-engine/postgres-engine";
import { addEnvToken, clearEnvTokens } from "@/lib/token/sql";

/*
 * Extracts table and field names from a SQL schema string.
 * 
 * @param {string} sqlString - The SQL schema string to extract names from
 * @returns {string[]} An array of unique table and field names
 */
function extractTableAndFieldNames(sqlString: string): string[] {
    const extractedNames = new Set<string>();
    const createTableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
    const fieldRegex = /"?(\w+)"?\s+\w+(?:\s*\(\d+\))?(?:\s*NOT\s+NULL|\s*NULL)?/gi;
    
    let tableMatch: RegExpExecArray | null;
    while ((tableMatch = createTableRegex.exec(sqlString)) !== null) {
        const tableName = tableMatch[1];
        const fieldsDefinition = tableMatch[2];
        
        extractedNames.add(tableName);

        let fieldMatch: RegExpExecArray | null;
        const fieldRegexCopy = new RegExp(fieldRegex);
        while ((fieldMatch = fieldRegexCopy.exec(fieldsDefinition)) !== null) {
            extractedNames.add(fieldMatch[1]);
        }
    }
    
    return Array.from(extractedNames);
}

/**
 * A React provider component that initializes and provides a `PGlite` instance to the component tree.
 * The `PGlite` instance is created asynchronously and made available via the `PgExecEngineContext`.
 *
 * This component ensures that only one `PGlite` instance is created and shared across the application.
 * If the instance is already initialized, it will not create a new one.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {React.ReactElement} - The provider component with the `PGlite` instance in its context.
 *
 * @example
 * // Usage in the application
 * <PgExecEngineProvider>
 *     <App />
 * </PgExecEngineProvider>
 */
export const PgExecEngineProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }): React.ReactElement => {
    const [pg, setPg] = useState<PostgresExecutionEngine | undefined>();
    const updateSchema = async (schema: string) => {
        if (pg?.isInitialized()) {
            await pg.destroy();
        } 

        clearEnvTokens();
        addEnvToken(...extractTableAndFieldNames(schema));
        setPg(await PostgresExecutionEngine.create(schema));
    };

    return (
        <PgExecEngineContext.Provider value={{ pg, updateSchema }}>
            {children}
        </PgExecEngineContext.Provider>
    );
};