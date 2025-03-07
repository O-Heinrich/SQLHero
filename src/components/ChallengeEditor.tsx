/**
 * @module SQLEditorModule
 * @description
 * Provides a theme-aware SQL code editor component using Ace Editor.
 * 
 * This module includes:
 * - A React component for rendering an interactive SQL editor
 * - Integration with custom theme hooks
 * - Advanced editor configurations
 * 
 * Key Features:
 * - Dynamic theme switching (light/dark)
 * - Syntax highlighting for SQL
 * - Live autocompletion
 * - Responsive sizing
 * 
 * @requires react
 * @requires @/hooks/useTheme
 * @requires react-ace
 * @requires ace-builds
 */

import React from "react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/ext-language_tools";
import { useTheme } from "@/hooks/useTheme";

/**
 * Props interface for the ChallengeEditor component
 * @interface ChallengeEditorProps
 * @description Defines the shape of props accepted by the ChallengeEditor
 */
interface ChallengeEditorProps {
    /** Reference to the editor value
     * @type {React.RefObject<string>}
     */
    valueRef: React.RefObject<string>;
}

/**
 * SQL code editor component with theme awareness
 * @component
 * @description
 * Provides a full-featured SQL editor using Ace Editor with:
 * - Syntax highlighting
 * - Autocompletion
 * - Theme-aware styling
 * - Line numbers
 * - Live autocompletion
 * 
 * @param {ChallengeEditorProps} props - Component properties
 * @returns {React.ReactElement} Rendered SQL editor component
 * 
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * <ChallengeEditor 
 *   value={query} 
 *   setValue={setQuery}
 * />
 * ```
 */
export const ChallengeEditor: React.FC<ChallengeEditorProps> = ({
    valueRef,
}) => {
    /** 
     * Retrieve the current theme from the theme hook 
     * @type {Object}
     */
    const { theme } = useTheme();

    return (
        <AceEditor
            mode="sql"
            theme={theme === 'dark' ? 'one_dark' : 'iplastic'}
            width='100%'
            height='100%'
            className='border-2 border-ridge shadow-lg border-gray-300 dark:border-gray-700 absolute inset-0'
            setOptions={{
                /** Enable basic autocompletion */
                enableBasicAutocompletion: true,
                /** Enable live autocompletion */
                enableLiveAutocompletion: true,
                /** Enable code snippets */
                enableSnippets: true,
                /** Show line numbers */
                showLineNumbers: true,
                /** Set tab size */
                tabSize: 4,
                /** Set cursor style */
                cursorStyle: 'smooth',
            }}
            fontSize={16}
            value={valueRef?.current ?? ''}

            /** Handle changes to the editor content */
            onChange={(newValue: string) => {
                valueRef.current = newValue
            }}
            name="editor"
            editorProps={{ $blockScrolling: true }}
        />
    );
}