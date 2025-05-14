/**
 * @module QueryResultTableModule
 * @description
 * Provides a React component for rendering SQL query results in a tabular format.
 * 
 * Key Features:
 * - Dynamic table rendering based on query results
 * - Memoized data transformation
 * - Fallback rendering for empty or invalid results
 * 
 * @requires react
 * @requires @/components/table
 * @requires @/lib/exec-engine/postgres-engine
 * @requires @/lib/utils
 */

import { useMemo } from "react";
import { Table } from '@/components/table';
import { QueryResult } from '@/lib/exec-engine/postgres-engine';
import { queryResultToStringArray } from '@/lib/utils';
// FIXME: This import is intentionally used as workaround for weird issue in dev mode
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { JavaScriptExecutionResult } from "@/lib/exec-engine/javascript-engine.ts";

/**
 * Props interface for QueryResultTable component
 * 
 * Defines the properties required for rendering a table that displays
 * SQL query execution results in a structured format.
 * 
 * @interface QueryResultTableProps
 */
interface QueryResultTableProps {
    /**
     * Unique identifier for the result table
     * Used for DOM identification and accessibility purposes
     * 
     * @type {string}
     * @required
     */
    id: string;

    /**
     * Query result data to display in the table
     * Optional as it may not be available before query execution
     * Contains fields, rows, and metadata from the executed query
     * 
     * @type {QueryResult}
     * @optional
     */
    result?: QueryResult;
}

/** 
 * Query result table component
 * 
 * @description 
 * Renders SQL query results in a tabular format with intelligent handling of different result states.
 * 
 * Key Behaviors:
 * - Transforms query results into a format suitable for table rendering
 * - Uses memoization to optimize performance
 * - Provides a fallback empty table when no results are available
 * 
 * @component
 * @param {QueryResultTableProps} props - Component properties
 * @returns {React.ReactElement} Rendered table with query results or placeholder
 * 
 * @example
 * ```tsx
 * const queryResult: QueryResult = // ... fetch or execute query
 * <QueryResultTable 
 *   id="user-query-results" 
 *   result={queryResult} 
 * />
 * ```
 */
export const QueryResultTable: React.FC<QueryResultTableProps> = ({
    result,
    ...props
}: {
    result?: QueryResult;
    id: string;
}): React.ReactElement => {
    /**
     * Memoized transformation of query result to table-compatible format
     * 
     * @type {TableData | undefined}
     * @description Converts QueryResult to columns and rows, cached for performance
     */
    const data = useMemo(() => result && queryResultToStringArray(result), [result]);

    return (
        <>
            {data && result && result.fields.length
                // Render table with query results
                ? <Table {...props} columns={data.columns} rows={data.rows} />
                // Fallback to empty table when no results
                : <Table id={props.id} columns={['Ergebnis Tabelle']} rows={[['']]} />
            }
        </>
    );
}