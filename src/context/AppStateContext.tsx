/**
 * This module provides a React context (`AppStateContext`) and a provider component (`AppStateProvider`)
 * for managing the application state using a reducer. The state includes challenges, a header element reference,
 * and the current challenge. The provider initializes the state and sets up the reducer, and it also initializes
 * the challenges from a predefined list on mount.
 * 
 * The context makes the state and dispatch function available to all components in the component tree.
 * 
 * @module context/AppStateContext
 */

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { appReducer } from '@/lib/reducer';
import { AppState, ChallengeAction, Challenge } from '@/lib/types';
import { CHALLENGES } from 'virtual:sql-hero';
import { loadState } from '@/lib/storage';

/**
 * The initial state of the application. This includes an empty challenges map,
 * a null header element reference, and an undefined current challenge.
 */
const initialState: AppState = {
    challenges: [],
    headerElement: null,
    currentChallenge: undefined
};

/**
 * The React context for the application state. It provides the state and a dispatch function
 * for updating the state using actions. The context is initialized with `undefined` as the default value.
 */
const AppStateContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<ChallengeAction>;
} | undefined>(undefined);

/**
 * A provider component that wraps the application and provides the state and dispatch function
 * to all components in the tree. It initializes the state using a reducer and sets up the initial
 * challenges on mount.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} - The provider component with the state and dispatch function.
 *
 * @example
 * <AppStateProvider>
 *     <App />
 * </AppStateProvider>
 */
const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize the state using the appReducer
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Initialize challenges on component mount
    useEffect(() => {
        // Map the predefined challenges to include completion and attempt status
        const initialChallenges = loadState()?.challenges || CHALLENGES.map(Challenge.fromShortChallenge);

        // Dispatch the INIT_CHALLENGES action to set up the initial state
        dispatch({ type: 'INIT_CHALLENGES', payload: initialChallenges });
    }, []);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    );
};

export {
    AppStateContext,
    AppStateProvider
};