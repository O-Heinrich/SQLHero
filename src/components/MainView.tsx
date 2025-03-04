import { useEffect, useState } from 'react';
import {
    DockviewApi,
    DockviewReact,
    DockviewReadyEvent,
    IDockviewHeaderActionsProps,
    IDockviewPanelProps,
    SerializedDockview,
    DockviewPanelApi,
} from 'dockview';


function usePanelWindowObject(api: DockviewPanelApi): Window|null {
    const [document, setDocument] = useState<Window | null>(null);

    useEffect(() => {
        const disposable = api.onDidLocationChange(() => {
            setDocument(api.getWindow());
        });

        return () => {
            disposable.dispose();
        };
    }, [api]);

    return document;
}

