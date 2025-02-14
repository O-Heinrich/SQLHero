/**
* Types and interfaces for the challenge application state management
* @module lib/types
*/

/**
* Represents a single challenge entity.
* Tracks challenge metadata including completion status and attempt history.
*/
export interface Challenge {
    /** Unique number identifier for the challenge */
    no: number;

    /** Display title of the challenge */
    title: string;

    /** Whether the challenge has been successfully completed */
    completed: boolean;

    /** Whether the challenge has been attempted at least once */
    attempted: boolean;

    /** Timestamp of the most recent attempt, if any */
    lastAttempt?: Date;
}

/**
* Global application state interface.
* Contains challenges data and UI-related state.
*/
export interface AppState {
    /** Map of challenge IDs to Challenge objects */
    challenges: Record<string, Challenge>;

    /** Reference to header DOM element for scroll animations */
    headerElement: HTMLHeadingElement | null;

    /** ID of the currently active challenge, if any */
    currentChallenge?: string;
}

/**
* Union type defining all possible actions that can modify the app state.
* Each action has a specific type identifier and associated payload data.
*/
export type ChallengeAction =
    /** Marks a challenge as completed */
    | { type: 'COMPLETE_CHALLENGE'; payload: { id: string } }

    /** Records an attempt on a challenge */
    | { type: 'ATTEMPT_CHALLENGE'; payload: { id: string } }

    /** Updates the header element reference */
    | { type: 'SET_HEADER_REF'; payload: HTMLHeadingElement }

    /** Sets the currently active challenge */
    | { type: 'SET_CURRENT_CHALLENGE'; payload: string }

    /** Initializes the challenges list */
    | { type: 'INIT_CHALLENGES'; payload: Challenge[] };