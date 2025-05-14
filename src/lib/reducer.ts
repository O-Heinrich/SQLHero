/**
 * This module defines the `appReducer` function, which is a reducer for managing the state.
 * It handles actions related to completing challenges, attempting challenges, initializing
 * challenges, setting the current challenge, and managing a reference to the header element.
 * 
 * The reducer follows the principles of Redux-style state management, where it takes the current state and
 * an action, and returns a new state based on the action type and payload.
 * 
 * @module lib/reducer
 */

import { AppState, ChallengeAction } from "@/lib/types";
import { loadState, saveState } from "@/lib/storage";

export const toggleHeaderSuccess = (hasFailed: boolean, headerElement: HTMLHeadingElement | null) => {
    headerElement?.classList.add(hasFailed ? 'dark:bg-red-500/50' : 'dark:bg-green-500/50');
    headerElement?.classList.add(hasFailed ? 'bg-red-800/50' : 'bg-green-800/50');
    headerElement?.classList.remove(hasFailed ? 'dark:bg-green-500/50' : 'dark:bg-red-500/50');
    headerElement?.classList.remove(hasFailed ? 'bg-green-800/50' : 'bg-red-800/50');
}

/**
 * A reducer function that manages the state of the application based on dispatched actions.
 * It handles various actions related to challenges, such as completing, attempting, initializing,
 * and setting the current challenge, as well as managing the header element reference.
 *
 * @param {AppState} state - The current state of the application.
 * @param {ChallengeAction} action - The action dispatched to the reducer, which contains a type and payload.
 * @returns {AppState} - The new state of the application after applying the action.
 */
export const appReducer = (state: AppState, action: ChallengeAction): AppState => {    
    let newState: AppState;

    switch (action.type) {
        case 'INIT_CHALLENGE': {
            const challenge = state.challenges[action.payload.index];

            if (challenge) {
                challenge.startAttempt();
            }

            newState = state;
            break;
        }

        case 'COMPLETE_CHALLENGE': {
            toggleHeaderSuccess(false, state.headerElement);
            const challenge = state.challenges[action.payload.index];

            if (challenge) {
                challenge.completed = true;
                challenge.failed = false;
                challenge.endAttempt(true, action.payload.query);
            }

            newState = state;
            break;
        }

        case 'UPDATE_CHALLENGE': {
            const challenge = state.challenges[action.payload.index];
            if (challenge) {
                newState = {
                    ...state,
                    challenges: [
                        ...state.challenges.slice(0, action.payload.index),
                        { ...challenge, currentValue: action.payload.values } as Challenge,
                        ...state.challenges.slice(action.payload.index + 1),
                    ],
                };
            } else {
                newState = state;
            }
            break;
        }

        case 'CHALLENGE_FAILED': {
            toggleHeaderSuccess(true, state.headerElement);
            const challenge = state.challenges[action.payload.index];

            if (challenge) {
                challenge.completed = false;
                challenge.failed = true;
                challenge.endAttempt(false, action.payload.query); 
            }

            newState = state;
            break;
        }

        case 'SET_HEADER_REF':
            newState = {
                ...state,
                headerElement: action.payload,
            };

            break;

        case 'SET_CURRENT_CHALLENGE':
            newState = {
                ...state,
                currentChallenge: action.payload,
            };

            break;

        case 'INIT_CHALLENGES': {
            newState = {
                ...state,
                challenges: action.payload,
            };

            break;
        }

        case 'LOAD_STATE': {
            const loadedState = loadState();

            if (!loadedState) {
                return appReducer(state, { 
                    type: 'INIT_CHALLENGES', 
                    payload: [],
                });
            }

            newState = {
                ...state,
                ...loadedState,
            };

            break;
        }

        default:
            newState = state; // Returns the current state if the action type is not recognized
    }

    saveState(newState);
    return newState;
};