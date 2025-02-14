import { PGlite } from "@electric-sql/pglite";
import { createContext } from "react";

export interface IPGliteContext {
    pg: PGlite | undefined;
}

export const PGlightContext = createContext<IPGliteContext>({
    pg: undefined,
});