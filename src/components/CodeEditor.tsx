/**
 * @file CodeEditor.tsx
 * @description A wrapper component for Monaco Editor that uses an uncontrolled approach
 * to prevent cursor position reset issues and provide better integration with Monaco's
 * internal state management system. Features PostgreSQL dialect syntax highlighting.
 */

import { useResizeObserver } from '@/hooks/useResizeObserver';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useCallback, useRef, JSX, useMemo, useState } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { SqlToken } from '@/lib/token';
import { historyUpdate } from '@/lib/storage';
import { debounce } from '@/lib/utils';

/**
 * Props for the CodeEditor component
 * @interface CodeEditorProps
 * @property {string} value - The initial or updated value to display in the editor
 * @property {function} onChange - Callback function that receives the updated editor content
 */
export interface CodeEditorProps {
    /** The current value to display in the editor */
    value: string;
    /** Monaco Editor reference */
    ref?: React.RefObject<monaco.editor.IStandaloneCodeEditor>;
}

const DEBOUNCE_DELAY = 1500;

/**
 * Calculates the zero-based index of the current challenge based on the URL path.
 *
 * Extracts the last segment of the current window location's pathname,
 * parses it as an integer, and returns the value minus one.
 * If the path segment is not present or cannot be parsed, defaults to 0.
 *
 * @returns {number} The zero-based index of the challenge.
 */
function challengeIndex(): number {
    const path = window.location.pathname.split('/').pop();
    return parseInt(path ?? '1', 10) - 1;
}

/**
 * CodeEditor component that wraps Monaco Editor using an uncontrolled approach
 * to prevent cursor reset issues and provide better performance.
 * Includes PostgreSQL dialect syntax highlighting.
 *
 * @component
 * @param {CodeEditorProps} props - The component props
 * @returns {JSX.Element} The rendered editor component
 *
 * @example
 * ```tsx
 * const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users');
 * 
 * <CodeEditor 
 *   value={sqlQuery} 
 *   onChange={(newValue) => setSqlQuery(newValue)} 
 * />
 * ```
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({ value, ref }: CodeEditorProps): JSX.Element => {
    /** Current theme from the theme hook */
    const { theme: heroTheme } = useTheme();
    /** Reference to the container div element */
    const containerRef = useRef<HTMLDivElement>(null);
    /** Resize Observer instance */
    const resizeOberve = useResizeObserver();
    /** Memorized theme name */
    const theme = useMemo(() => heroTheme, [heroTheme]);
    /** Store last value */
    const [lastValue, setLastValue] = useState<string|null>();

    /**
     * Handles resize events for the editor container
     * Resizes the editor layout when the container dimensions change
     * 
     * @param {ResizeObserverEntry[]} entries - The resize observer entries
     */
    const onResizeEvent = useCallback((entries: ResizeObserverEntry[]) => {
        if (ref?.current && entries.length > 0) {
            const { width, height } = entries[0].contentRect;
            ref!.current.layout({ width, height });
        }
    }, [ref]);

    /**
     * Set up resize observer to handle container size changes
     */
    useEffect(() => {
        if (containerRef.current) {
            resizeOberve(containerRef.current, onResizeEvent);
        }
    }, [resizeOberve, containerRef, onResizeEvent]);

    useEffect(() => {
        if (!ref?.current) {
            // Define light theme
            monaco.editor.defineTheme('light', {
                base: 'vs',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#f6f6f6',
                    'editor.lineHighlightBackground': '#ffffff66',
                    'editorHighlight.foreground': '#fefefefe66',
                },
            });

            // Define dark theme
            monaco.editor.defineTheme('dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#414a60',
                    'editor.lineHighlightBackground': '#ffffff11',
                    'editorHighlight.foreground': '#fefefefe66',
                },
            });

            // Register SQL language
            monaco.languages.register({ id: 'sql' });

            // Register SQL completion provider
            monaco.languages.registerCompletionItemProvider('sql', {
                triggerCharacters: [' ', '.', '(', ')', ',', '"'],
                provideCompletionItems: function(model, position) {
                    const word = model.getWordUntilPosition(position);
                    const token = word.word.replace(/"/g, '').toUpperCase();
                    return {
                        suggestions: SqlToken.suggest(token).map((suggestion) => ({
                            label: suggestion,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: suggestion,
                            range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                        })),
                    };
                }
            });
            
            // Set up PostgreSQL SQL syntax highlighting
            monaco.languages.setMonarchTokensProvider("sql", {
                defaultToken: "invalid",
                ignoreCase: true, // PostgreSQL keywords are case-insensitive

                // Define arrays for matching in rules
                keywords: SqlToken.keywords,
                typeKeywords: SqlToken.types,
                functions: SqlToken.functions,
                tokenizer: SqlToken.tokenizer,
            });

            ref!.current = monaco.editor.create(containerRef.current!, {
                value,
                language: 'sql',
                lineNumbers: 'on',	
                automaticLayout: false,
                minimap: {
                    enabled: false,
                },
                scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                },
                wordWrap: 'on',
                wrappingIndent: 'same',
                wrappingStrategy: 'advanced',
                renderWhitespace: 'all',
                contextmenu: true,


            });

            const handleKeyUp = debounce((event: monaco.IKeyboardEvent) => {
                const value = ref!.current?.getValue();
                historyUpdate(challengeIndex(), value);
            }, DEBOUNCE_DELAY);

            ref!.current.onKeyUp(handleKeyUp);
        }
    }, [value, ref, containerRef]);


    useEffect(() => {
        monaco.editor.setTheme(theme);
    }, [theme]);

    return (
        <div id="editor" ref={containerRef} className="w-full h-full pt-[30px]" />
    );
};