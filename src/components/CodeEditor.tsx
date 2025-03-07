/**
 * @file CodeEditor.tsx
 * @description A wrapper component for Monaco Editor that uses an uncontrolled approach
 * to prevent cursor position reset issues and provide better integration with Monaco's
 * internal state management system. Features PostgreSQL dialect syntax highlighting.
 */

import { useResizeObserver } from '@/hooks/useResizeObserver';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useCallback, useRef, JSX, useState, useMemo } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { SqlToken } from '@/lib/token';

/**
 * Props for the CodeEditor component
 * @interface CodeEditorProps
 * @property {string} value - The initial or updated value to display in the editor
 * @property {function} onChange - Callback function that receives the updated editor content
 */
export interface CodeEditorProps {
    /** The current value to display in the editor */
    value: string;
    /** Callback function that receives the updated editor content when changes occur */
    ref: React.RefObject<string>;
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CodeEditor: React.FC<CodeEditorProps> = ({ value, ref }: CodeEditorProps): JSX.Element => {
    /** Current theme from the theme hook */
    const { theme: heroTheme } = useTheme();
    /** Reference to the container div element */
    const containerRef = useRef<HTMLDivElement>(null);
    /** Reference to the Monaco editor instance */
    // const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    /** Custom resize observer hook */
    const resizeOberve = useResizeObserver();
    /** Flag to track if this is the initial mount */
    const isInitialMount = useRef(true);
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

    const theme = useMemo(() => heroTheme, [heroTheme]);

    /**
     * Handles resize events for the editor container
     * Resizes the editor layout when the container dimensions change
     * 
     * @param {ResizeObserverEntry[]} entries - The resize observer entries
     */
    const onResizeEvent = useCallback((entries: ResizeObserverEntry[]) => {
        if (editor && entries.length > 0) {
            const { width, height } = entries[0].contentRect;
            editor.layout({ width, height });
        }
    }, [editor]);

    /**
     * Update editor value when the value prop changes externally
     * Preserves cursor position and selection during updates
     */
    // useEffect(() => {
    //     if (editorRef.current) {
    //         // Skip on initial mount as we'll set the value in onMount handler
    //         if (isInitialMount.current) {
    //             isInitialMount.current = false;
    //             return;
    //         }

    //         // Only update if the value differs from current editor content
    //         // Only update if the value differs from current editor content
    //         const currentValue = editorRef.current.getValue();
    //         if (value !== currentValue) {
    //             // Save cursor position
    //             const position = editorRef.current.getPosition();
    //             const selection = editorRef.current.getSelection();

    //             // Update value
    //             editorRef.current.setValue(value);

    //             // Restore cursor position and selection
    //             if (position) {
    //                 editorRef.current.setPosition(position);
    //             }
    //             if (selection) {
    //                 editorRef.current.setSelection(selection);
    //             }

    //             onChange(value);
    //             // Ensure focus is maintained
    //             editorRef.current.focus();
    //         }
    //     }
    // }, [onChange, value]);

    /**
     * Set up resize observer to handle container size changes
     */
    useEffect(() => {
        if (containerRef.current) {
            resizeOberve(containerRef.current, onResizeEvent);
        }
    }, [resizeOberve, containerRef, onResizeEvent]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
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

            const instance = monaco.editor.create(containerRef.current!, {
                value,
                language: 'sql',
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
                contextmenu: false,
            });

            instance.onDidChangeModelContent(() => {
                ref.current = instance.getValue();
            });

            setEditor(instance);
            return () => editor?.dispose();
        }
    }, [value, ref, editor]);


    useEffect(() => {
        monaco.editor.setTheme(theme);
    }, [theme]);

    return (
        <div ref={containerRef} className="w-full" style={{ height: 'calc(100% - 76px)' }} />
    );
};