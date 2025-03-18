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

import React from 'react';
import { monacoEditor } from 'monaco-editor';
import { toast } from 'sonner';
import { AppState, Challenge } from "@/lib/types";
import { DockviewApi } from 'dockview-react';

const STORAGE_KEY = 'sql-hero-state';

/**
 * Loads the application state from local storage.
 * @returns {AppState | undefined} - The loaded state or undefined if not found.
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
        return undefined;
    }
}

/**
 * Saves the application state to local storage.
 * @param {AppState} state - The state to save.
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

export function savePanels(api: DockviewApi): void {
    try {
        const json = api.toJSON();

        if (json && json.panels && json.panels['editorPanel'] && json.panels['editorPanel'].params) {
            json.panels['editorPanel'].params.ref.current = undefined;
        }

        if (json && json.panels && json.panels['lessonPanel'] && json.panels['lessonPanel'].params) {
            json.panels['lessonPanel'].params.lessonRef.current = undefined;
        }
        const serializedState = JSON.stringify(json);
        console.log(json);
        localStorage.setItem('dockview-layout', serializedState);
    } catch (err) {
        const errMsg = typeof err === 'string' ? err : (err as Error).message;
        console.error(err);
        toast.error(`Error saving panels: ${errMsg}`);
    }
}

export function loadPanels(api: DockviewApi): boolean {
    try {
        const serializedState = localStorage.getItem('dockview-layout');
        if (serializedState === null) {
            return false;
        }

        const json = JSON.parse(serializedState);
        
        if (!json || !json.panels || !json.panels['editorPanel'] || !json.panels['lessonPanel'] || !json.panels['erdPanel']) {
            return false;
        }

        json.panels['editorPanel'].params.ref = React.createRef<monacoEditor.IStandaloneCodeEditor | null>();
        api.fromJSON(json);
        return true;
    } catch (err) {
        const errMsg = typeof err === 'string' ? err : (err as Error).message;
        toast.error(`Error loading panels: ${errMsg}`);
        return false;
    }
}   