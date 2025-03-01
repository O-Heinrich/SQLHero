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

import { toast } from 'sonner';
import { AppState, Challenge } from "@/lib/types";

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