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
    switch (action.type) {
        case 'COMPLETE_CHALLENGE': {
            
            return {
                ...state,
                challenges: {
                    ...state.challenges,
                    [action.payload.id]: {
                        ...state.challenges[action.payload.id],
                        completed: true, // Marks the challenge as completed
                        lastAttempt: new Date() // Updates the last attempt timestamp
                    }
                }
            };
        }

        case 'ATTEMPT_CHALLENGE':
            return {
                ...state,
                challenges: {
                    ...state.challenges,
                    [action.payload.id]: {
                        ...state.challenges[action.payload.id],
                        attempted: true, // Marks the challenge as attempted
                        lastAttempt: new Date() // Updates the last attempt timestamp
                    }
                }
            };

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