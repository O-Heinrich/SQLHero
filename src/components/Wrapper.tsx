import React from "react";
import clsx from "clsx";

interface WrapperProps extends React.PropsWithChildren {
    className?: string;
}

/**
 * Wrapper component for consistent layout and responsive container
 * 
 * @component
 * @param {WrapperProps} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @param {string} [props.className] - Additional CSS classes to apply
 * 
 * @description
 * Creates a responsive container with:
 * - Maximum width constraints
 * - Horizontal padding
 * - Centered layout
 * - Ability to extend with custom classes
 * 
 * @example
 * ```tsx
 * <Wrapper className="custom-padding">
 *   <Content />
 * </Wrapper>
 * ```
 * 
 * @returns {React.ReactElement} Responsive container with children
 */
export const Wrapper: React.FC<WrapperProps> = ({ children, className }: WrapperProps): React.ReactElement => {
    /**
     * Memoizes additional classes for performance optimization
     * @type {string[]}
     * @note Potentially unnecessary in React v19, requires testing
     */
    const classes: string[] = React.useMemo(() => className?.split(' ') || [], [className]);

    return (
        <div className={clsx('w-full', 'max-w-[1440px]', 'lg:px-2', 'px-4', 'mx-auto', ...classes)}>
            {children}
        </div>
    );
};