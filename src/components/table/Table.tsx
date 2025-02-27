import clsx from "clsx";

export interface TableProps {
    id?: string;
    columns: string[];
    rows: unknown[][];
}

export const Table: React.FC<TableProps> = ({ id, columns, rows }) => (
    <table id={id} className={clsx('min-w-full', 'divide-y', 'divide-gray-200', 'dark:divide-gray-700', 'shadow-lg', 'h-full', 'overflow-hidden')}>
        <thead className={clsx('bg-slate-50/0', 'dark:bg-slate-700/0', 'sticky', 'top-0', 'z-10')}>
            <tr>
                {columns.map((column, index) => (
                    <th key={index} className={clsx('p-2')}>{column}</th>
                ))}
            </tr>
        </thead>
        <tbody className={clsx('bg-white', 'divide-y', 'divide-gray-200', 'dark:bg-gray-800', 'dark:divide-gray-700', 'overflow-y-auto')}>
            {rows.map((row, index) => (
                <tr key={index} className={clsx('hover:bg-gray-50', 'dark:hover:bg-gray-700')}>
                    {row.map((cell, index) => (
                        <td key={index} className={clsx('p-2', !isNaN(Number(cell)) && 'text-right')}>{cell as string}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);