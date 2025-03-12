/**
 * This module provides a React context (`PgExecEngineContext`) for managing a `PGlite` instance.
 * The context holds a `PGlite` object, which is a lightweight PostgreSQL-compatible database.
 * This allows the database instance to be shared across the application.
 *
 * The context is initialized with a default value where the `pg` property is `undefined`.
 * Consumers of the context can provide a `PGlite` instance to make it available to the component tree.
 *
 * @module context/PgExecEngineContext
 */

import { PostgresExecutionEngine } from "@/lib/exec-engine/postgres-engine";
import { createContext } from "react";

/**
 * Represents the structure of the `PGlightContext`. It contains a `PGlite` instance
 * or `undefined` if no instance has been provided.
 */
export interface IPGliteContext {
    /**
     * The `PGlite` instance, which is a lightweight PostgreSQL-compatible database.
     * This property is `undefined` by default and can be set to a `PGlite` instance.
     */
    pg: PostgresExecutionEngine | undefined;
    updateSchema: (schema: string) => Promise<void>;
    getSchema: () => string;
}

/**
 * The React context for managing a `PGlite` instance. It provides a `PGlite` object
 * to all components in the tree. The context is initialized with a default value
 * where the `pg` property is `undefined`.
 *
 * @example
 * // Providing a PGlite instance to the context
 * const pgInstance = new PGlite();
 * <PgExecEngineContext.Provider value={{ pg: pgInstance }}>
 *     <App />
 * </PgExecEngineContext.Provider>
 */
export const PgExecEngineContext = createContext<IPGliteContext>({
    pg: undefined, 
    updateSchema: async () => { throw new Error("updateSchema not implemented"); },
    getSchema: () => { throw new Error("getSchema not implemented"); }
});