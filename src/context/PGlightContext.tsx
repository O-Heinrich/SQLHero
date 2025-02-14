/**
 * This module provides a React context (`PGlightContext`) for managing a `PGlite` instance.
 * The context holds a `PGlite` object, which is a lightweight PostgreSQL-compatible database.
 * This allows the database instance to be shared across the application.
 *
 * The context is initialized with a default value where the `pg` property is `undefined`.
 * Consumers of the context can provide a `PGlite` instance to make it available to the component tree.
 *
 * @module context/PGlightContext
 */

import { PGlite } from "@electric-sql/pglite";
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
    pg: PGlite | undefined;
}

/**
 * The React context for managing a `PGlite` instance. It provides a `PGlite` object
 * to all components in the tree. The context is initialized with a default value
 * where the `pg` property is `undefined`.
 *
 * @example
 * // Providing a PGlite instance to the context
 * const pgInstance = new PGlite();
 * <PGlightContext.Provider value={{ pg: pgInstance }}>
 *     <App />
 * </PGlightContext.Provider>
 *
 * @example
 * // Consuming the context in a component
 * const { pg } = useContext(PGlightContext);
 * if (pg) {
 *     // Use the PGlite instance
 * }
 */
export const PGlightContext = createContext<IPGliteContext>({
    pg: undefined, // Default value for the context
});