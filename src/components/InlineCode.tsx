import * as React from "react";
import clsx from "clsx"

/**
 * InlineCode component for rendering themed, responsive code snippets
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Content to be displayed within inline code
 * 
 * @description
 * Renders an inline code element with:
 * - Responsive text sizing
 * - Theme-dependent styling (dark/light modes)
 * - Consistent formatting and appearance
 * 
 * @example
 * ```tsx
 * <InlineCode>npm install</InlineCode>
 * ```
 * 
 * @returns {React.ReactElement} Styled inline code container
 */
export const InlineCode: React.FC<{children: React.ReactNode}> = ({ children }: { children: React.ReactNode; }): React.ReactElement => (
    <code className={
        clsx(
            'text-sm',
            'sm:text-base',
            'inline-flex',
            'text-left',
            'items-center',
            'border-1',
            'border-slate-300',
            'dark:border-slate-600',
            'bg-gray-200',
            'dark:bg-slate-700',
            'text-blue-700',
            'dark:text-blue-400',
            'rounded-lg',
            'line-height[1]',
            'p-1',
        )
    }>
        <span className="flex gap-4">
            <span className="flex-1">
                {children}
            </span>
        </span>
    </code>
);