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

const toggleHeaderSuccess = (hasFailed: boolean, headerElement: HTMLHeadingElement | null) => {
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
    console.log(action, state);
    switch (action.type) {
        case 'COMPLETE_CHALLENGE': {
            toggleHeaderSuccess(false, state.headerElement);
            return {
                ...state,
                challenges: {
                    ...state.challenges,
                    [action.payload.id]: {
                        ...state.challenges[action.payload.id],
                        failed: false, // Marks the challenge as failed
                        completed: true, // Marks the challenge as completed
                        lastAttempt: new Date() // Updates the last attempt timestamp
                    }
                }
            };
        }

        case 'ATTEMPT_CHALLENGE': {
            toggleHeaderSuccess(false, state.headerElement);
            return {
                ...state,
                challenges: {
                    ...state.challenges,
                    [action.payload.id]: {
                        ...state.challenges[action.payload.id],
                        failed: false, // Marks the challenge as failed
                        attempted: true, // Marks the challenge as attempted
                        lastAttempt: new Date() // Updates the last attempt timestamp
                    }
                }
            };
        }

        case 'CHALLENGE_FAILED': {
            toggleHeaderSuccess(true, state.headerElement);
            return {
                ...state,
                challenges: {
                    ...state.challenges,
                    [action.payload.id]: {
                        ...state.challenges[action.payload.id],
                        failed: true, // Marks the challenge as failed
                        lastAttempt: new Date(), // Updates the last attempt timestamp
                        difference: action.payload.difference // Stores the difference for the failed attempt
                    }
                }
            };
        }

        case 'SET_HEADER_REF':
            return {
                ...state,
                headerElement: action.payload // Sets the reference to the header element
            };

        case 'SET_CURRENT_CHALLENGE':
            return {
                ...state,
                currentChallenge: action.payload // Sets the current challenge
            };

        case 'INIT_CHALLENGES': {
            // Converts the array of challenges into a map for easier access by challenge number
            const challengesMap = action.payload.reduce((acc, challenge) => ({
                ...acc,
                [challenge.no.toString()]: challenge
            }), {});

            return {
                ...state,
                challenges: challengesMap // Initializes the challenges map in the state
            };
        }

        default:
            return state; // Returns the current state if the action type is not recognized
    }
};