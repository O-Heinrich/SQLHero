import clsx from "clsx";

export interface TableProps {
    columns: string[];
    rows: unknown[][];
}

export const Table: React.FC<TableProps> = ({ columns, rows }) => (
    <table className={clsx('min-w-full', 'divide-y', 'divide-gray-200', 'dark:divide-gray-700', 'my-8', 'rounded-lg', 'overflow-hidden', 'shadow-lg')}>
        <thead className={clsx('bg-slate-50', 'dark:bg-slate-700')}>
            <tr>
                {columns.map((column, index) => (
                    <th key={index} className={clsx('p-2')}>{column}</th>
                ))}
            </tr>
        </thead>
        <tbody className={clsx('bg-white', 'divide-y', 'divide-gray-200', 'dark:bg-gray-800', 'dark:divide-gray-700')}>
            {rows.map((row, index) => (
                <tr key={index} className={clsx('hover:bg-gray-50', 'dark:hover:bg-gray-700')}>
                    {row.map((cell, index) => (
                        <td key={index} className={clsx('p-2')}>{cell as string}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);