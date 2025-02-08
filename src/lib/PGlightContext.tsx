import { PGlite } from "@electric-sql/pglite";
import { createContext } from "react";

export interface PGliteContextType {
    pg: PGlite | undefined;
}

export const PGlightContext = createContext<PGliteContextType>({
    pg: undefined,
});