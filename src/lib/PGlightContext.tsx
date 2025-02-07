import { PGliteWithLive } from "@electric-sql/pglite/live";
import { createContext } from "react";

export interface PGliteContextType {
    pg: PGliteWithLive | undefined;
}

export const PGlightContext = createContext<PGliteContextType>({
    pg: undefined,
});