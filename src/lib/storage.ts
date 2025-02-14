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

import { AppState } from "@/lib/types";
import { toast } from "sonner";

/**
 * Saves the application state to the browser's local storage.
 * The state is serialized to a JSON string, with the `headerElement` property set to `null`
 * to avoid serialization issues. If an error occurs during the process, a toast notification
 * is displayed to inform the user.
 *
 * @param {AppState} state - The application state to be saved.
 * @returns {void}
 *
 * @example
 * const state = { challenges: {}, currentChallenge: null, headerElement: document.getElementById('header') };
 * saveStateToStorage(state); // Saves the state to local storage
 */
export const saveStateToStorage = (state: AppState): void => {
    try {
        // Serialize the state, ensuring `headerElement` is set to `null`
        const serializedState = JSON.stringify({
            ...state,
            headerElement: null
        });
        localStorage.setItem('appState', serializedState);
    } catch (error) {
        // Handle errors and display a toast notification
        const errMsg = error instanceof Error ? error.message : error;
        toast.error(`Could not save state: ${errMsg}`);
    }
};

/**
 * Loads the application state from the browser's local storage.
 * The state is deserialized from a JSON string. If no state is found in local storage,
 * or if an error occurs during the process, a toast notification is displayed to inform
 * the user, and `undefined` is returned.
 *
 * @returns {Partial<AppState> | undefined} - The deserialized application state, or `undefined` if no state is found or an error occurs.
 *
 * @example
 * const state = loadStateFromStorage(); // Loads the state from local storage
 * if (state) {
 *     console.log('Loaded state:', state);
 * }
 */
export const loadStateFromStorage = (): Partial<AppState> | undefined => {
    try {
        // Retrieve the serialized state from local storage
        const serializedState = localStorage.getItem('appState');
        if (serializedState === null) return undefined; // Return undefined if no state is found

        // Deserialize the state and return it
        return JSON.parse(serializedState);
    } catch (error) {
        // Handle errors and display a toast notification
        const errMsg = error instanceof Error ? error.message : error;
        toast.error(`Could not load state: ${errMsg}`);
        return undefined;
    }
};