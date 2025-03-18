/**
 * This module provides utility functions for saving and loading the application state to and from
 * the browser's local storage. It handles serialization and deserialization of the state, and
 * includes error handling with user-friendly notifications using the `sonner` toast library.
 * 
 * The state is saved with the `headerElement` property set to `null` to avoid serialization issues
 * with non-serializable data (e.g., DOM elements).
 * 
 * @module lib/storage
 */

import * as monaco from 'monaco-editor';
import { toast } from 'sonner';
import { AppState, Challenge } from "@/lib/types";
import { DockviewApi } from 'dockview-react';
import React from 'react';

const STORAGE_KEY = 'sql-hero-state';
const LAYOUT_KEY = 'dockview-layout_' + STORAGE_KEY;

/**
* Loads the application state from local storage.
* 
* Retrieves the serialized state from localStorage using the predefined storage key,
* deserializes it, and transforms challenge objects into proper Challenge instances.
* If an error occurs during loading or parsing, a toast error notification is displayed
* and the stored data is purged.
* 
* @returns {AppState | undefined} 
* The deserialized application state, or undefined if the state doesn't exist in storage
* or an error occurred during loading.
*/
export function loadState(): AppState | undefined {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        
        if (serializedState === null) {
            return undefined;
        }

        const state = JSON.parse(serializedState);
        state.challenges = state.challenges.map(Challenge.fromObject);

        return state;
    } catch (err) {
        const errMsg = typeof err === 'string' ? err : (err as Error).message;
        toast.error(`Error loading state: ${errMsg}`);
        localStorage.removeItem(STORAGE_KEY);
        return undefined;
    }
}

/**
 * Saves the application state to local storage.
 * 
 * Creates a copy of the provided state with the headerElement property set to null
 * to avoid serialization issues with DOM elements, then stringifies and stores it
 * in localStorage using the predefined storage key. If an error occurs during saving,
 * a toast error notification is displayed.
 * 
 * @param {AppState} state - The current application state to be saved
 * @returns {void}
 */
export function saveState(state: AppState): void {
    try {
        const storageState = { ...state, headerElement: null };
        const serializedState = JSON.stringify(storageState);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
        const errMsg = typeof err === 'string' ? err : (err as Error).message;
        toast.error(`Error saving state: ${errMsg}`);
    }
}

/**
 * Saves the panel layout configuration to local storage.
 * 
 * This function serializes the current dockview layout state along with the 
 * current query content. It handles cleaning up non-serializable properties 
 * (like ref.current) before storing.
 * 
 * @param {DockviewApi} api - The Dockview API instance to save the layout from
 * @param {string} query - The current SQL query content to save
 */
export function savePanels(api: DockviewApi, query: string): void {
    try {
        const json = api.toJSON();
        const serializedState = JSON.stringify({
            editor: api.getPanel('editorPanel')?.params?.ref?.current?.saveViewState(),
            ...json,
            panels: {
                ...json?.panels,
                'editorPanel': {
                    ...json.panels['editorPanel'],
                    params: {
                        ...json.panels['editorPanel']?.params,
                        query,
                        ref: {
                            ...json.panels['editorPanel']?.params?.ref ?? {},
                            current: null
                        }
                    }
                },
                'lessonPanel': {
                    ...json.panels['lessonPanel'],
                    params: {
                        ...json.panels['lessonPanel']?.params,
                        lessonRef: null
                    }
                }
            }
        });
 
        localStorage.setItem(LAYOUT_KEY, serializedState);
    } catch (err) {
        const errMsg = typeof err === 'string' ? err : (err as Error).message;
        toast.error(`Error saving panels: ${errMsg}`);
        localStorage.removeItem(LAYOUT_KEY);
    }
}

/**
 * Loads the panel layout configuration from local storage.
 * 
 * This function deserializes the stored dockview layout and restores the editor state.
 * It also reattaches the editor reference to the configuration. If an error occurs during
 * loading or parsing, a toast error notification is displayed and the stored data is purged.
 * 
 * @param {DockviewApi} api - The Dockview API instance to restore the layout to
 * @param {React.RefObject<monaco.editor.IStandaloneCodeEditor | null>} editorRef - Reference to the Monaco editor instance
 * @returns {boolean} - Returns true if the layout was successfully loaded, false otherwise
 */
export function loadPanels(api: DockviewApi, editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>): boolean {
    try {
        const serializedState = localStorage.getItem(LAYOUT_KEY);
        if (serializedState === null) {
            return false;
        }

        const json = JSON.parse(serializedState);
        
        if (!json || !json.panels || !json.panels['editorPanel'] || !json.panels['lessonPanel'] || !json.panels['erdPanel']) {
            return false;
        }

        api.fromJSON(json);

        if (json.panels['editorPanel'].params.ref) {
            json.panels['editorPanel'].params.ref.current = editorRef.current;
        }

        return true;
    } catch (err) {
        const errMsg = typeof err === 'string' ? err : (err as Error).message;
        toast.error(`Error loading panels: ${errMsg}`);
        localStorage.removeItem(LAYOUT_KEY);
        return false;
    }
}   