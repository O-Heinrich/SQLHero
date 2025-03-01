import { ReactNode,  useState } from "react";
import { PgExecEngineContext } from "./PgExecEngineContext";
import { PostgresExecutionEngine } from "@/lib/exec-engine/postgres-engine";

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
        const instance = await PostgresExecutionEngine.create(schema);
        setPg(instance);
    };

    return (
        <PgExecEngineContext.Provider value={{ pg, updateSchema }}>
            {children}
        </PgExecEngineContext.Provider>
    );
};