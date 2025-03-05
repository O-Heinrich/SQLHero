/**
 * @module Footer
 * @description 
 * Provides the application footer component with responsive theming
 * and branding elements that adapt to the current application theme.
 */
import React from "react";

import { useTheme } from "@/hooks/useTheme";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/ext-language_tools";


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
 * @param {Object} props - Component properties
 * @param {string} props.value - Current SQL query content
 * @param {React.Dispatch<string>} props.setValue - Function to update query content
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
export const ChallengeEditor: React.FC<{ value: string, setValue: React.Dispatch<string> }> = ({
    value, setValue
}: {
    value: string,
    setValue: React.Dispatch<string>
}) => {
    const { theme } = useTheme();
    return (
        <AceEditor
            mode="sql"
            theme={theme === 'dark' ? 'one_dark' : 'iplastic'}
            width='100%'
            height='100%'
            className='border-2 border-ridge shadow-lg border-gray-300 dark:border-gray-700 absolute inset-0'
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                cursorStyle: 'smooth',
            }}
            fontSize={16}
            value={value}
            onChange={(value: string) => setValue(value)}
            name="editor"
            editorProps={{ $blockScrolling: true }}
        />
    );
}