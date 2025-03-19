/**
 * @module EditorPanel
 * @description A code editor panel component for SQL challenges with execution capabilities
 * and integration with a postgres execution engine. This module provides functionality for
 * executing SQL queries, comparing results with expected solutions, and providing feedback
 * to users working through SQL challenges.
 */

import React from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { IDockviewPanelProps } from "dockview";
import { Toolbar } from "../Controls";
import { IconButton } from "@/components/buttons";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useContext, useMemo } from "react";
import { useChallengeNumber } from "@/hooks/useChallengeNumber";
import { useAppState } from "@/hooks/useAppState";
import { QueryResult, SqlExecutionResult } from "@/lib/exec-engine/postgres-engine";
import { ResultSetComparison } from "@/lib/utils";
import { toast } from "sonner";
import { TableDiff } from "@/lib/types";
import { PgExecEngineContext } from "@/context/PgExecEngineContext";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

/**
 * Props for the EditorPanel component
 * @interface EditorPanelProps
 * @property {string} initialContent - The initial content to display in the editor
 * @property {function} onExecuted - Callback function that receives the query result
 * @property {string} erdSrc - The source path for the ERD PDF file
 * @property {React.RefObject<monaco.editor.IStandaloneCodeEditor>} ref - A reference to the editor instance
 * @extends IDockviewPanelProps
 * @see {@link IDockviewPanelProps}
 * @see {@link monaco.editor.IStandaloneCodeEditor}
 * @see {@link QueryResult}
 * @see {@link EditorPanel}
 * @see {@link PgExecEngineContext}
 */
export type EditorPanelProps = IDockviewPanelProps<{
    initialContent: string;
    onExecuted?: (result: QueryResult) => void;
    erdSrc?: string;
    ref: React.RefObject<monaco.editor.IStandaloneCodeEditor>;
}>;

/**
 * EditorPanel component for SQL challenges
 * 
 * Provides an interface for users to write and execute SQL queries as part of
 * database challenges, with execution handling, result comparison, and feedback.
 * 
 * @component
 * @param {EditorPanelProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const EditorPanel: React.FunctionComponent<EditorPanelProps> = (props) => {
    const { state, dispatch } = useAppState();
    const { pg } = useContext(PgExecEngineContext)
    const challengeNumber = useChallengeNumber();
    const challengeIndex = useMemo(() => challengeNumber - 1, [challengeNumber]);

    /**
     * Background style for the challenge workspace
     * @constant
     */
    const BG_STYLE =
        'w-full h-full dark:bg-gray-700 dark:bg-blend-overlay bg-blend-multiply dark:to-slate-800 dark:from-gray-700/80 from-white to-gray-200 bg-radial bg-size-125 bg-radial-[at_50%_50%]';

    /**
     * Handles the execution of a SQL query or a series of SQL statements for a specific challenge.
     *
     * This function:
     * - Executes the SQL query/queries provided in the `editorRef`.
     * - Compares the result with a pre-stored solution (if available).
     * - Dispatches appropriate actions based on whether the challenge was completed successfully or not.
     * - Updates the UI to display the result or error messages.
     *
     * @async
     * @function handleRun
     * @returns {Promise<void>} - A promise that resolves when the function completes.
     *
     * @example
     * await handleRun();
     */
    const handleRun = React.useCallback(async (): Promise<void> => {
        // If the PostgreSQL client (`pg`) is not available, exit the function.
        if (!pg) return

        try {
            let queryResult: SqlExecutionResult | null = null
            const key = challengeNumber.toString() // Create a key for the current challenge.
            const result = await pg.execute(props.params.ref.current.getValue() ?? ''); // Execute the SQL query.

            if (!result.success) {
                throw new Error(
                    result.error ?? 'An error occurred while executing the query.',
                );
            }

            if (
                !ResultSetComparison.hasSolution(key) &&
                !ResultSetComparison.hasSolution(`${key}-0`)
            ) {
                queryResult = await pg.execute(state.currentChallenge?.query ?? '');
                if (queryResult?.success) {
                    for (let i = 0; i < queryResult.data!.length; i++) {
                        ResultSetComparison.storeSolutionHash(
                            `${key}-${i}`,
                            queryResult.data![i],
                        );
                    }
                } else {
                    throw new Error(
                        result.error ??
                        'An error occurred while executing the solution query.',
                    );
                }
            }

            const isCorrect = Boolean(result.data?.length) && result.data!.every((result, i) => {
                const key = `${challengeNumber.toString()}-${i}`;
                return ResultSetComparison.compareWithSolution(key, result);
            });

            if (props.params.onExecuted && result.data?.length > 0) {
                props.params.onExecuted(result.data[result.data?.length - 1]);
            }

            if (isCorrect) {
                toast.success('Erfolg', {
                    description: 'Ergebnis korrekt. Gut gemacht!',
                });
                dispatch({
                    type: 'COMPLETE_CHALLENGE',
                    payload: { index: challengeIndex, query: props.params.ref.current.getValue() ?? '' },
                });
            } else {
                toast.error('Fehler', {
                    description: 'Die gelieferten Datensätze stimmen nicht überein.',
                });
                dispatch({
                    type: 'CHALLENGE_FAILED',
                    payload: {
                        index: challengeIndex,
                        difference: {} as TableDiff,
                        query: props.params.ref.current.getValue() ?? '',
                    },
                });
            }
        } catch (error) {
            // Handle errors and display an error message.
            const errMsg = typeof error === 'string' ? error : (error as Error).message
            toast.error('Fehler beim Ausführen der Abfrage', {
                description: errMsg,
            });
        }
    }, [
        challengeIndex, 
        challengeNumber, 
        dispatch, 
        pg, 
        props.params, 
        state.currentChallenge?.query,
    ]);

    /**
     * Adds a keyup event listener to the window to handle the Ctrl+Enter key combination
     * for executing the SQL query.
     * 
     * @function
     * @returns {void}
     */ 
    React.useEffect(() => {
        /**
         * Handles the keyup event for the editor panel
         * @param {KeyboardEvent} event - The keyboard event
         * @returns {void}
         */
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'Enter') {
                handleRun();
            }
        };

        window.addEventListener('keyup', handleKeyUp);

        return () => window.removeEventListener('keyup', handleKeyUp);
    }, [handleRun]);

    /**
     * Renders the editor panel with code editor and toolbar controls
     * @returns {JSX.Element} The rendered component
     */
    return (
        <div className={BG_STYLE}>
            <CodeEditor value={props.params.initialContent} ref={props.params.ref} />
            <Toolbar className="absolute z-10 top-0 right-10 p-0! bg-transparent dark:bg-transparent">
                <IconButton
                    icon={<PlayIcon className="size-6 text-black/80 dark:text-white/80" />}
                    aria-label="SQL ausführen"
                    title="SQL ausführen"
                    variant="primary"
                    onClick={handleRun}
                />
            </Toolbar>
        </div>
    );
}