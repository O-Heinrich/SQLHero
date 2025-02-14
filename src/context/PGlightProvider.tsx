import { PGlite  } from "@electric-sql/pglite";
import { ReactNode, useEffect, useState } from "react";
import { PGlightContext } from "./PGlightContext";

export const PGlightProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }): React.ReactElement => {
    const [pg, setPg] = useState<PGlite  | undefined>();

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