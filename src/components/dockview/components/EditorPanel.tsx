import { CodeEditor } from "@/components/CodeEditor";
import { IDockviewPanelProps } from "dockview";
import { Toolbar } from "../Controls";
import { IconButton } from "@/components/buttons";
import { ArrowDownOnSquareStackIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useContext, useMemo, useRef } from "react";
import { useChallengeNumber } from "@/hooks/useChallengeNumber";
import { useAppState } from "@/hooks/useAppState";
import { QueryResult, SqlExecutionResult } from "@/lib/exec-engine/postgres-engine";
import { ResultSetComparison } from "@/lib/utils";
import { toast } from "sonner";
import { TableDiff } from "@/lib/types";
import { PgExecEngineContext } from "@/context/PgExecEngineContext";

export interface EditorPanelProps extends IDockviewPanelProps {
    initialContent: string;
    onExecuted?: (result: QueryResult) => void;
    erdSrc?: string;
}

export const EditorPanel: React.FunctionComponent<EditorPanelProps> = (props) => {
    const { state, dispatch } = useAppState();
    const { pg } = useContext(PgExecEngineContext)
    const challengeNumber = useChallengeNumber();
    const challengeIndex = useMemo(() => challengeNumber - 1, [challengeNumber]);
    const contentRef = useRef<string>(props.initialContent);
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
    const handleRun = async (): Promise<void> => {
        // If the PostgreSQL client (`pg`) is not available, exit the function.
        if (!pg) return

        try {
            let queryResult: SqlExecutionResult | null = null
            const key = challengeNumber.toString() // Create a key for the current challenge.
            const result = await pg.execute(contentRef.current ?? ''); // Execute the SQL query.

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

            const isCorrect = result.data!.reduce((success, result, i) => {
                const key = `${challengeNumber.toString()}-${i}`;
                return success && ResultSetComparison.compareWithSolution(key, result);
            }, Boolean(result.data?.length))

            if (props.onExecuted && result.data?.length > 0) {
                props.onExecuted(result.data[result.data?.length - 1]);
            }

            if (isCorrect) {
                toast.success('Erfolg', {
                    description: 'Ergebnis korrekt. Gut gemacht!',
                });
                dispatch({
                    type: 'COMPLETE_CHALLENGE',
                    payload: { index: challengeIndex, query: contentRef.current },
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
                        query: contentRef.current,
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
    }

    /**
     * Handles database schema PDF download
     *
     * Creates and triggers a download for the PDF version of the current challenge's
     * database schema. Extracts the appropriate filename from the schema path,
     * replacing the .sql extension with db.pdf.
     *
     * @function handleDownloadClick
     * @returns {void}
     */
    const handleDownloadClick = (): void => {
        const a = document.createElement('a')
        const file = props.erdSrc ?? ''
        a.href = `/databases/pdf/${file}`
        a.download = file
        a.click()
    }

    return (
        <div className={BG_STYLE}>
            <CodeEditor value={contentRef.current} ref={contentRef} />
            <Toolbar className="justify-center">
                <IconButton
                    icon={<ArrowDownOnSquareStackIcon className="size-6" />}
                    aria-label="ERD downloaden"
                    title="ERD downloaden"
                    onClick={handleDownloadClick}
                />
                <IconButton
                    icon={<PlayIcon className="size-6" />}
                    aria-label="SQL ausführen"
                    title="SQL ausführen"
                    variant="primary"
                    onClick={handleRun}
                />
            </Toolbar>
        </div>
    );
}