/**
 * @module hooks/usePanelWindowObject
 */
import { useEffect, useState } from 'react';
import { DockviewPanelApi } from 'dockview';

/**
 * This hook returns the window object of the panel.
 * 
 * @param api The panel api
 * @returns The window object of the panel
 */
export function usePanelWindowObject(api: DockviewPanelApi): Window|null {
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
