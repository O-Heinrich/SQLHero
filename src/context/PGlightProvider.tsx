import { PGlite  } from "@electric-sql/pglite";
import { ReactNode, useEffect, useState } from "react";
import { PGlightContext } from "./PGlightContext";

/**
 * A React provider component that initializes and provides a `PGlite` instance to the component tree.
 * The `PGlite` instance is created asynchronously and made available via the `PGlightContext`.
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
 * <PGlightProvider>
 *     <App />
 * </PGlightProvider>
 *
 * @example
 * // Consuming the context in a component
 * const { pg } = useContext(PGlightContext);
 * if (pg) {
 *     // Use the PGlite instance
 * }
 */
export const PGlightProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }): React.ReactElement => {
    const [pg, setPg] = useState<PGlite | undefined>();

    useEffect(() => {
        if (pg) return;
        PGlite.create().then(setPg);
    }, [pg]);

    return (
        <PGlightContext.Provider value={{ pg }}>
            {children}
        </PGlightContext.Provider>
    );
};