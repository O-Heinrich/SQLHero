/**
 * @module FlashButton
 * @description
 * A customizable, animated button component for React applications.
 * Features a flash animation on hover and supports multiple variants,
 * sizes, and states. Built with Tailwind CSS for styling.
 * 
 * Key features:
 * - Multiple color variants (primary, secondary, danger, etc.)
 * - Configurable sizes (sm, md, lg)
 * - Loading state with spinner
 * - Icon support
 * - Flash animation on hover
 * - Fully accessible
 * - Dark mode support
 * 
 * @example
 * ```tsx
 * <FlashButton
 *   label="Submit"
 *   variant="primary"
 *   size="md"
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 */

import { clsx } from "clsx";

interface FlashButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button label text
     * @type {string}
     */
    label: string;
    /**
     * Button color variant
     * @type {('primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info')}
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
    /**
     * Button size variant
     * @type {('sm' | 'md' | 'lg')}
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Button icon
     * @type {React.ReactElement}
     * @default null
     */
    icon?: React.ReactElement;
    /**
     * Button loading state
     * @type {boolean}
     * @default false
     */
    loading?: boolean;
    /**
     * Button disabled state
     * @type {boolean}
     * @default false
     */
    disabled?: boolean;
    /**
     * Button click handler
     * @type {Function}
     * @default () => {}
     */
    onClick?: () => void;
}

/**
 * FlashButton Component
 * @component
 * @description
 * A highly customizable button component with flash animation effect.
 * Supports various sizes, colors, and states through props.
 * 
 * Features:
 * - Responsive sizing (sm, md, lg)
 * - Multiple color variants
 * - Loading state with spinner
 * - Icon support
 * - Flash animation on hover
 * - Dark mode compatibility
 * 
 * Styling is handled through Tailwind CSS classes and includes:
 * - Hover and active states
 * - Focus rings for accessibility
 * - Disabled state styling
 * - Smooth transitions
 * - Flash animation effect
 * 
 * @param {FlashButtonProps} props - Component props
 * @returns {React.ReactElement} Rendered button component
 * 
 * @example
 * ```tsx
 * <FlashButton
 *   label="Click me"
 *   variant="primary"
 *   size="md"
 *   icon={<Icon />}
 *   onClick={() => handleClick()}
 * />
 * ```
 */
export const FlashButton: React.FC<FlashButtonProps> = (props: FlashButtonProps): React.ReactElement => (
    <button
        {...props}
        className={clsx(
            'group/button',
            'overflow-hidden',
            'flex justify-center items-center',
            'border border-transparent',
            'shadow-sm',
            'dark:text-white/85 text-black/85',
            'font-light',
            'transition-all',
            'duration-250',
            'ease-in-out',
            'rounded-md',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-offset-2',
            'focus:ring-offset-gray-100',
            'focus:ring-primary-500',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
            'transition',
            'duration-150',
            'ease-in-out',
            'hover:opacity-90',
            'active:opacity-80',
            'focus:opacity-80',
            'focus:ring',
            'focus:ring-opacity-50',
            'focus:ring-primary-500',
            'focus:ring-offset-gray-100',
            'focus:ring-offset-2',
            props.className,
            props.size === 'sm' && 'mx-2 my-4 px-2 py-1 text-xl',
            props.size === 'md' && 'mx-3 my-6 px-6 py-2 text-2xl',
            props.size === 'lg' && 'mx-4 my-8 px-8 py-3 text-3xl',
            props.variant === 'primary' && 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 focus:bg-primary-800',
            props.variant === 'secondary' && 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 focus:bg-gray-800',
            props.variant === 'danger' && 'bg-red-600 hover:bg-red-700 active:bg-red-800 focus:bg-red-800',
            props.variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 focus:bg-yellow-800',
            props.variant === 'success' && 'bg-green-600 hover:bg-green-700 active:bg-green-800 focus:bg-green-800',
            props.variant === 'info' && 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-800',
            props.disabled && 'opacity-50 cursor-not-allowed',
        )}
        disabled={props.disabled || props.loading}
        onClick={props.onClick}
    >
        {props.icon && (
            <span className={clsx('mr-2', props.loading && 'animate-spin')}>
                {props.icon}
            </span>
        )}
        
        <span className={clsx(
            props.size === 'sm' && 'text-xl',
            props.size === 'md' && 'text-2xl',
            props.size === 'lg' && 'text-3xl',
        )}>{props.label}</span>
        <div
            className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
        >
            <div className="relative h-full w-10 bg-white/60 dark:bg-white/15"></div>
        </div>
    </button>
)