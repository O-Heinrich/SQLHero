/**
 * @file CodeEditor.tsx
 * @description A wrapper component for Monaco Editor that uses an uncontrolled approach
 * to prevent cursor position reset issues and provide better integration with Monaco's
 * internal state management system. Features PostgreSQL dialect syntax highlighting.
 */

import { useResizeObserver } from '@/hooks/useResizeObserver';
import { useTheme } from '@/hooks/useTheme';
import Editor, { OnMount, useMonaco } from '@monaco-editor/react';
import { useEffect, useCallback, useRef, JSX } from 'react';
import * as monaco from 'monaco-editor';

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
    onChange: (value: string) => void;
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
export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }: CodeEditorProps): JSX.Element => {
    /** Reference to the Monaco instance */
    const monaco = useMonaco();
    /** Current theme from the theme hook */
    const { theme } = useTheme();
    /** Reference to the container div element */
    const containerRef = useRef<HTMLDivElement>(null);
    /** Reference to the Monaco editor instance */
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    /** Custom resize observer hook */
    const resizeOberve = useResizeObserver();
    /** Flag to track if this is the initial mount */
    const isInitialMount = useRef(true);
    
    /**
     * Handles resize events for the editor container
     * Resizes the editor layout when the container dimensions change
     * 
     * @param {ResizeObserverEntry[]} entries - The resize observer entries
     */
    const onResizeEvent = useCallback(
        (entries: ResizeObserverEntry[]) => {
            if (editorRef.current && entries.length > 0) {
                const { width, height } = entries[0].contentRect;
                editorRef.current.layout({ width, height });
            }
        },
        []
    );

    /**
     * Handles the editor mounting event
     * Sets up the editor instance and initial configurations
     * 
     * @param {monaco.editor.IStandaloneCodeEditor} editor - The Monaco editor instance
     * @param {monaco.editor.ICodeEditorViewState} monaco - The Monaco editor API
     */
    const handleEditorDidMount: OnMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        // Store the editor reference
        editorRef.current = editor;

        // Set initial value
        editor.setValue(value);
        
        // Add change listener to notify parent of content changes
        editor.onDidChangeModelContent(() => {
            const newValue = editor.getValue();
            onChange(newValue);
        });
    };

    /**
     * Set up Monaco themes and language configuration
     * Runs when Monaco instance is available or theme changes
     */
    useEffect(() => {
        if (monaco) {
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

            const sqlKeywords = [
                'ABORT', 'ABSOLUTE', 'ACCESS', 'ACTION', 'ADD', 'ADMIN', 'AFTER', 'AGGREGATE', 'ALL', 
                'ALSO', 'ALTER', 'ALWAYS', 'ANALYSE', 'ANALYZE', 'AND', 'ANY', 'ARRAY', 'AS', 'ASC', 
                'ASSERTION', 'ASSIGNMENT', 'ASYMMETRIC', 'AT', 'ATTACH', 'ATTRIBUTE', 'AUTHORIZATION', 
                'BACKWARD', 'BEFORE', 'BEGIN', 'BETWEEN', 'BIGINT', 'BINARY', 'BIT', 'BOOLEAN', 'BOTH', 
                'BY', 'CACHE', 'CALL', 'CALLED', 'CASCADE', 'CASCADED', 'CASE', 'CAST', 'CATALOG', 
                'CHAIN', 'CHAR', 'CHARACTER', 'CHARACTERISTICS', 'CHECK', 'CHECKPOINT', 'CLASS', 'CLOSE', 
                'CLUSTER', 'COALESCE', 'COLLATE', 'COLLATION', 'COLUMN', 'COLUMNS', 'COMMENT', 'COMMENTS', 
                'COMMIT', 'COMMITTED', 'CONCURRENTLY', 'CONFIGURATION', 'CONFLICT', 'CONNECTION', 'CONSTRAINT', 
                'CONSTRAINTS', 'CONTENT', 'CONTINUE', 'CONVERSION', 'COPY', 'COST', 'CREATE', 'CROSS', 'CSV', 
                'CUBE', 'CURRENT', 'CURRENT_CATALOG', 'CURRENT_DATE', 'CURRENT_ROLE', 'CURRENT_SCHEMA', 
                'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER', 'CURSOR', 'CYCLE', 'DATA', 'DATABASE', 
                'DAY', 'DEALLOCATE', 'DEC', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DEFAULTS', 'DEFERRABLE', 
                'DEFERRED', 'DEFINER', 'DELETE', 'DELIMITER', 'DELIMITERS', 'DEPENDS', 'DESC', 'DETACH', 
                'DICTIONARY', 'DISABLE', 'DISCARD', 'DISTINCT', 'DO', 'DOCUMENT', 'DOMAIN', 'DOUBLE', 'DROP', 
                'EACH', 'ELSE', 'ENABLE', 'ENCODING', 'ENCRYPTED', 'END', 'ENUM', 'ESCAPE', 'EVENT', 'EXCEPT', 
                'EXCLUDE', 'EXCLUDING', 'EXCLUSIVE', 'EXECUTE', 'EXISTS', 'EXPLAIN', 'EXPRESSION', 'EXTENSION', 
                'EXTERNAL', 'EXTRACT', 'FALSE', 'FAMILY', 'FETCH', 'FILTER', 'FIRST', 'FLOAT', 'FOLLOWING', 
                'FOR', 'FORCE', 'FOREIGN', 'FORWARD', 'FREEZE', 'FROM', 'FULL', 'FUNCTION', 'FUNCTIONS', 
                'GENERATED', 'GLOBAL', 'GRANT', 'GRANTED', 'GREATEST', 'GROUP', 'GROUPING', 'GROUPS', 'HANDLER', 
                'HAVING', 'HEADER', 'HOLD', 'HOUR', 'IDENTITY', 'IF', 'ILIKE', 'IMMEDIATE', 'IMMUTABLE', 'IMPLICIT', 
                'IMPORT', 'IN', 'INCLUDE', 'INCLUDING', 'INCREMENT', 'INDEX', 'INDEXES', 'INHERIT', 'INHERITS', 
                'INITIALLY', 'INLINE', 'INNER', 'INOUT', 'INPUT', 'INSENSITIVE', 'INSERT', 'INSTEAD', 'INT', 'INTEGER', 
                'INTERSECT', 'INTERVAL', 'INTO', 'INVOKER', 'IS', 'ISNULL', 'ISOLATION', 'JOIN', 'KEY', 'LABEL', 
                'LANGUAGE', 'LARGE', 'LAST', 'LATERAL', 'LEADING', 'LEAKPROOF', 'LEAST', 'LEFT', 'LEVEL', 'LIKE', 
                'LIMIT', 'LISTEN', 'LOAD', 'LOCAL', 'LOCALTIME', 'LOCALTIMESTAMP', 'LOCATION', 'LOCK', 'LOCKED', 
                'LOGGED', 'MAPPING', 'MATCH', 'MATERIALIZED', 'MAXVALUE', 'METHOD', 'MINUTE', 'MINVALUE', 'MODE', 
                'MONTH', 'MOVE', 'NAME', 'NAMES', 'NATIONAL', 'NATURAL', 'NCHAR', 'NEW', 'NEXT', 'NFC', 'NFD', 
                'NFKC', 'NFKD', 'NO', 'NONE', 'NORMALIZE', 'NORMALIZED', 'NOT', 'NOTHING', 'NOTIFY', 'NOTNULL', 
                'NOWAIT', 'NULL', 'NULLIF', 'NULLS', 'NUMERIC', 'OBJECT', 'OF', 'OFF', 'OFFSET', 'OIDS', 'OLD', 
                'ON', 'ONLY', 'OPERATOR', 'OPTION', 'OPTIONS', 'OR', 'ORDER', 'ORDINALITY', 'OTHERS', 'OUT', 'OUTER', 
                'OVER', 'OVERLAPS', 'OVERLAY', 'OVERRIDING', 'OWNED', 'OWNER', 'PARALLEL', 'PARSER', 'PARTIAL', 
                'PARTITION', 'PASSING', 'PASSWORD', 'PLACING', 'PLANS', 'POLICY', 'POSITION', 'PRECEDING', 'PRECISION', 
                'PREPARE', 'PREPARED', 'PRESERVE', 'PRIMARY', 'PRIOR', 'PRIVILEGES', 'PROCEDURAL', 'PROCEDURE', 
                'PROCEDURES', 'PROGRAM', 'PUBLICATION', 'QUOTE', 'RANGE', 'READ', 'REAL', 'REASSIGN', 'RECHECK', 
                'RECURSIVE', 'REF', 'REFERENCES', 'REFERENCING', 'REFRESH', 'REINDEX', 'RELATIVE', 'RELEASE', 
                'RENAME', 'REPEATABLE', 'REPLACE', 'REPLICA', 'RESET', 'RESTART', 'RESTRICT', 'RETURNING', 'RETURNS', 
                'REVOKE', 'RIGHT', 'ROLE', 'ROLLBACK', 'ROLLUP', 'ROUTINE', 'ROUTINES', 'ROW', 'ROWS', 'RULE', 
                'SAVEPOINT', 'SCHEMA', 'SCHEMAS', 'SCROLL', 'SEARCH', 'SECOND', 'SECURITY', 'SELECT', 'SEQUENCE', 
                'SEQUENCES', 'SERIALIZABLE', 'SERVER', 'SESSION', 'SESSION_USER', 'SET', 'SETOF', 'SETS', 'SHARE', 
                'SHOW', 'SIMILAR', 'SIMPLE', 'SKIP', 'SMALLINT', 'SNAPSHOT', 'SOME', 'SQL', 'STABLE', 'STANDALONE', 
                'START', 'STATEMENT', 'STATISTICS', 'STDIN', 'STDOUT', 'STORAGE', 'STORED', 'STRICT', 'STRIP', 
                'SUBSCRIPTION', 'SUBSTRING', 'SUPPORT', 'SYMMETRIC', 'SYSID', 'SYSTEM', 'TABLE', 'TABLES', 
                'TABLESAMPLE', 'TABLESPACE', 'TEMP', 'TEMPLATE', 'TEMPORARY', 'TEXT', 'THEN', 'TIES', 'TIME', 
                'TIMESTAMP', 'TO', 'TRAILING', 'TRANSACTION', 'TRANSFORM', 'TREAT', 'TRIGGER', 'TRIM', 'TRUE', 
                'TRUNCATE', 'TRUSTED', 'TYPE', 'TYPES', 'UESCAPE', 'UNBOUNDED', 'UNCOMMITTED', 'UNENCRYPTED', 
                'UNION', 'UNIQUE', 'UNKNOWN', 'UNLISTEN', 'UNLOGGED', 'UNTIL', 'UPDATE', 'USER', 'USING', 'VACUUM', 
                'VALID', 'VALIDATE', 'VALIDATOR', 'VALUE', 'VALUES', 'VARCHAR', 'VARIADIC', 'VARYING', 'VERBOSE', 
                'VERSION', 'VIEW', 'VIEWS', 'VOLATILE', 'WHEN', 'WHERE', 'WHITESPACE', 'WINDOW', 'WITH', 'WITHIN', 
                'WITHOUT', 'WORK', 'WRAPPER', 'WRITE', 'XML', 'XMLATTRIBUTES', 'XMLCONCAT', 'XMLELEMENT', 'XMLEXISTS', 
                'XMLFOREST', 'XMLNAMESPACES', 'XMLPARSE', 'XMLPI', 'XMLROOT', 'XMLSERIALIZE', 'XMLTABLE', 'YEAR', 
                'YES', 'ZONE'
            ];

            const sqlTypes = [
                'BIGINT', 'BIT', 'BOOLEAN', 'BOX', 'BYTEA', 'CHAR', 'CHARACTER', 'CIDR', 'CIRCLE', 'DATE', 
                'DECIMAL', 'DOUBLE', 'FLOAT', 'INET', 'INT', 'INTEGER', 'INTERVAL', 'JSON', 'JSONB', 'LINE', 
                'LSEG', 'MACADDR', 'MONEY', 'NUMERIC', 'PATH', 'PG_LSN', 'POINT', 'POLYGON', 'REAL', 'SMALLINT', 
                'TEXT', 'TIME', 'TIMESTAMP', 'TSQUERY', 'TSVECTOR', 'UUID', 'VARCHAR', 'XML', 'YEAR'
            ];

            const sqlFunctions = [
                'AVG', 'COUNT', 'MAX', 'MIN', 'SUM', 'ARRAY_AGG', 'JSON_AGG', 'JSONB_AGG', 'JSON_OBJECT_AGG', 
                'JSONB_OBJECT_AGG', 'STRING_AGG', 'ABS', 'CBRT', 'CEIL', 'CEILING', 'DEGREES', 'DIV', 'EXP', 
                'FLOOR', 'LN', 'LOG', 'MOD', 'PI', 'POWER', 'RADIANS', 'RANDOM', 'ROUND', 'SCALE', 'SIGN', 
                'SQRT', 'TRUNC', 'WIDTH_BUCKET', 'RANDOM', 'SETSEED', 'ACOS', 'ASIN', 'ATAN', 'ATAN2', 'COS', 
                'COT', 'SIN', 'TAN', 'BIT_LENGTH', 'CHAR_LENGTH', 'CHARACTER_LENGTH', 'LOWER', 'OCTET_LENGTH', 
                'OVERLAY', 'POSITION', 'SUBSTRING', 'TRIM', 'UPPER', 'ASCII', 'BTRIM', 'CHR', 'CONCAT', 'CONCAT_WS', 
                'FORMAT', 'INITCAP', 'LENGTH', 'LPAD', 'LTRIM', 'MD5', 'PARSE_IDENT', 'PG_CLIENT_ENCODING', 
                'QUOTE_IDENT', 'QUOTE_LITERAL', 'QUOTE_NULLABLE', 'REGEXP_MATCH', 'REGEXP_MATCHES', 'REGEXP_REPLACE', 
                'REGEXP_SPLIT_TO_ARRAY', 'REGEXP_SPLIT_TO_TABLE', 'REPEAT', 'REPLACE', 'REVERSE', 'RPAD', 'RTRIM', 
                'SPLIT_PART', 'STRPOS', 'SUBSTR', 'TO_ASCII', 'TO_HEX', 'TRANSLATE', 'AGE', 'CLOCK_TIMESTAMP', 
                'DATE_PART', 'DATE_TRUNC', 'EXTRACT', 'ISFINITE', 'JUSTIFY_DAYS', 'JUSTIFY_HOURS', 'JUSTIFY_INTERVAL', 
                'MAKE_DATE', 'MAKE_INTERVAL', 'MAKE_TIME', 'MAKE_TIMESTAMP', 'MAKE_TIMESTAMPTZ', 'NOW', 
                'STATEMENT_TIMESTAMP', 'TIMEOFDAY', 'TRANSACTION_TIMESTAMP', 'TO_CHAR', 'TO_DATE', 'TO_NUMBER', 
                'TO_TIMESTAMP', 'ARRAY_APPEND', 'ARRAY_CAT', 'ARRAY_DIMS', 'ARRAY_FILL', 'ARRAY_LENGTH', 'ARRAY_LOWER', 
                'ARRAY_NDIMS', 'ARRAY_POSITION', 'ARRAY_POSITIONS', 'ARRAY_PREPEND', 'ARRAY_REMOVE', 'ARRAY_REPLACE', 
                'ARRAY_TO_STRING', 'ARRAY_UPPER', 'CARDINALITY', 'STRING_TO_ARRAY', 'UNNEST', 'ISEMPTY', 
                'JSON_ARRAY_LENGTH', 'JSON_EACH', 'JSON_EACH_TEXT', 'JSON_EXTRACT_PATH', 'JSON_EXTRACT_PATH_TEXT', 
                'JSON_OBJECT', 'JSON_OBJECT_KEYS', 'JSON_POPULATE_RECORD', 'JSON_POPULATE_RECORDSET', 'JSON_TO_RECORD', 
                'JSON_TO_RECORDSET', 'JSON_TYPEOF', 'TO_JSON', 'TO_JSONB', 'ARRAY_TO_JSON', 'ROW_TO_JSON', 
                'JSONB_ARRAY_LENGTH', 'JSONB_EACH', 'JSONB_EACH_TEXT', 'JSONB_EXTRACT_PATH', 'JSONB_EXTRACT_PATH_TEXT', 
                'JSONB_OBJECT', 'JSONB_OBJECT_KEYS', 'JSONB_POPULATE_RECORD', 'JSONB_POPULATE_RECORDSET', 
                'JSONB_TO_RECORD', 'JSONB_TO_RECORDSET', 'JSONB_TYPEOF', 'TO_JSONB', 'ARRAY_TO_JSONB', 'ROW_TO_JSONB', 
                'JSON_ARRAY_ELEMENTS', 'JSON_ARRAY_ELEMENTS_TEXT', 'JSONB_ARRAY_ELEMENTS', 'JSONB_ARRAY_ELEMENTS_TEXT', 
                'JSON_BUILD_ARRAY', 'JSON_BUILD_OBJECT', 'JSONB_BUILD_ARRAY', 'JSONB_BUILD_OBJECT', 'JSON_INSERT', 
                'JSONB_INSERT', 'JSON_STRIP_NULLS', 'JSONB_STRIP_NULLS', 'JSONB_SET', 'JSONB_PRETTY'
            ];

            // Set up PostgreSQL SQL syntax highlighting
            monaco.languages.setMonarchTokensProvider("sql", {
                defaultToken: "invalid",
                ignoreCase: true, // PostgreSQL keywords are case-insensitive
                
                // Define arrays for matching in rules
                keywords: sqlKeywords,
                typeKeywords: sqlTypes,
                functions: sqlFunctions,
                
                tokenizer: {
                    root: [
                        { include: "@whitespace" },
                        { include: "@comments" },
                        { include: "@numbers" },
                        { include: "@strings" },
                        { include: "@identifiers" },
                        { include: "@operators" },
                        { include: "@punctuation" },
                    ],
                                        
                    operators: [
                        [/!=|<>|==|<=|>=|[-+*/%<>=&|^~]/, "operator"],
                        [/::/, "operator.special"], // PostgreSQL cast operator
                    ],
                    
                    punctuation: [
                        [/[;,.]/, "delimiter"],
                        [/[()[\]{}]/, "delimiter.parenthesis"],
                    ],
                    
                    whitespace: [
                        [/\s+/, "white"],
                    ],
                    
                    comments: [
                        [/--.*$/, "comment"],
                        [/\/\*/, "comment", "@comment_block"],
                    ],
                    
                    comment_block: [
                        [/[^/*]+/, "comment"],
                        [/\*\//, "comment", "@pop"],
                        [/[/*]/, "comment"],
                    ],
                    
                    numbers: [
                        [/[$]?\d+(\.\d+)?([eE][-+]?\d+)?/, "number"],
                        [/[$]?\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
                        [/[$]?0[xX][0-9a-fA-F]+/, "number.hex"],
                    ],
                    
                    strings: [
                        [/'/, "string", "@string_single"],
                        [/"/, "string.identifier", "@string_double"],
                        [/\$\$/, "string", "@dollar_string"],
                        [/\$[a-zA-Z0-9_]*\$/, "string", "@dollar_tagged_string"],
                        [/E'/, "string", "@escaped_single_string"],
                    ],
                    
                    string_single: [
                        [/[^']+/, "string"],
                        [/''/, "string.escape"],
                        [/'/, "string", "@pop"],
                    ],
                    
                    string_double: [
                        [/[^"]+/, "string.identifier"],
                        [/""/, "string.identifier.escape"],
                        [/"/, "string.identifier", "@pop"],
                    ],
                    
                    dollar_string: [
                        [/[^$]+/, "string"],
                        [/\$\$/, "string", "@pop"],
                        [/\$/, "string"],
                    ],
                    
                    dollar_tagged_string: [
                        [/[^$]+/, "string"],
                        [/\$[a-zA-Z0-9_]*\$/, "string", "@pop"],
                        [/\$/, "string"],
                    ],
                    
                    escaped_single_string: [
                        [/[^'\\]+/, "string"],
                        [/\\./, "string.escape"],
                        [/'/, "string", "@pop"],
                    ],
                    
                    identifiers: [
                        [/[a-zA-Z_]\w*/, {
                            cases: {
                                '@keywords': 'keyword',
                                '@typeKeywords': 'type',
                                '@functions': 'keyword.function',
                                '@default': 'identifier'
                            }
                        }],
                    ],
                },
            });

            // Apply the current theme
            monaco.editor.setTheme(theme);
            editorRef.current?.setValue(value);
        }
    }, [monaco, theme, value]);

    /**
     * Update editor value when the value prop changes externally
     * Preserves cursor position and selection during updates
     */
    useEffect(() => {
        if (editorRef.current) {
            // Skip on initial mount as we'll set the value in onMount handler
            if (isInitialMount.current) {
                isInitialMount.current = false;
                return;
            }
            
            // Only update if the value differs from current editor content
            // Only update if the value differs from current editor content
            const currentValue = editorRef.current.getValue();
            if (value !== currentValue) {
                // Save cursor position
                const position = editorRef.current.getPosition();
                const selection = editorRef.current.getSelection();
                
                // Update value
                editorRef.current.setValue(value);
                
                // Restore cursor position and selection
                if (position) {
                    editorRef.current.setPosition(position);
                }
                if (selection) {
                    editorRef.current.setSelection(selection);
                }
                
                // Ensure focus is maintained
                editorRef.current.focus();
            }
        }
    }, [value]);

    /**
     * Set up resize observer to handle container size changes
     */
    useEffect(() => {
        if (containerRef.current) {
            resizeOberve(containerRef.current, onResizeEvent);
        }
    }, [resizeOberve, containerRef, onResizeEvent]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <Editor
                height="90%"
                width="100%"
                className="mx-auto"
                theme={theme}
                defaultLanguage="sql"
                loading={
                    <div className="flex items-center justify-center w-full h-full">
                        {'Lade...'}
                    </div>
                }
                onMount={handleEditorDidMount}
            />
        </div>
    );
};