/**
 * @module Footer
 * @description 
 * Provides the application footer component with responsive theming
 * and branding elements that adapt to the current application theme.
 */
import {useMemo} from "react";
import { Table } from '@/components/table';
import { QueryResult} from '@/lib/exec-engine/postgres-engine';
import { queryResultToStringArray } from '@/lib/utils';


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
    * @property {string} id
    */
    id: string;
    /**
    * Query result data to display in the table
    * Optional as it may not be available before query execution
    * Contains fields, rows, and metadata from the executed query
    * 
    * @property {QueryResult} [result]
    */
    result?: QueryResult;
}

/** 
 * Query result table component
 * 
 * @description 
 * The component uses the Table component to render the query result data in a tabular format.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {QueryResult} props.result - Query result data
 * @param {string} props.id - Unique table identifier
 * @returns {React.ReactElement} Query result table
 */
export const QueryResultTable: React.FC<QueryResultTableProps> = ({
    result,
    ...props
}: {
    result?: QueryResult;
    id: string;
}): React.ReactElement => {
    const data = useMemo(() => result && queryResultToStringArray(result), [result]);
    return (
        <>
            {data && result && result.fields.length
                ? <Table {...props} columns={data.columns} rows={data.rows} />
                : <Table id={props.id} columns={['Ergebnis Tabelle']} rows={[['']]} />
            }
        </>
    );
}