import { useContext } from "react";
import { AppStateContext } from "@/context/AppStateContext";

/**
 * A custom React hook that provides access to the application state and dispatch function
 * from the `AppStateContext`. This hook is a convenience wrapper around `useContext`
 * and ensures that the context is used within the appropriate provider.
 *
 * If the hook is used outside of the `AppStateProvider`, it throws an error to alert the developer.
 *
 * @returns {Object} - An object containing the application state and dispatch function.
 * @property {AppState} state - The current application state.
 * @property {React.Dispatch<ChallengeAction>} dispatch - The dispatch function for updating the state.
 *
 * @throws {Error} - Throws an error if the hook is used outside of the `AppStateProvider`.
 *
 * @example
 * const { state, dispatch } = useAppState();
 * dispatch({ type: 'COMPLETE_CHALLENGE', payload: { id: '1' } });
 */
export const useAppState = () => {
    // Retrieve the context value from AppStateContext
    const context = useContext(AppStateContext);

    // Throw an error if the context is not available (i.e., used outside of AppStateProvider)
    if (!context) {
        throw new Error('useAppState must be used within AppStateProvider');
    }

    // Return the context value (state and dispatch function)
    return context;
};