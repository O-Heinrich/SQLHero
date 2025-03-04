/**
 * Icon Button Component Module
 * 
 * This module provides a reusable button component with icon support,
 * extending the functionality of the Headless UI Button component.
 * 
 * @module components/buttons/icon-button
 */

import { Button, ButtonProps } from "@headlessui/react";
import { clsx } from "clsx";
import React from "react";

/**
 * Interface for IconButton component props
 * 
 * @interface IconButtonProps
 * @extends {ButtonProps} - Extends Headless UI Button props
 */
export interface IconButtonProps extends ButtonProps {
    /**
     * Icon element to be displayed within the button
     * Can be any valid React node (SVG, component, etc.)
     */
    icon: React.ReactNode;

    /**
     * Variant of the icon button
     * @default 'none'
     */
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'none';

    /**
     * Size of the icon button
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
};

/**
 * IconButton component
 * 
 * A button component designed specifically for displaying icons with
 * consistent styling. Wraps the Headless UI Button component.
 * 
 * @component
 * @param {IconButtonProps} props - Component properties
 * @returns {JSX.Element} Rendered icon button
 * 
 * @example
 * ```tsx
 * // Basic usage with an SVG icon
 * <IconButton 
 *   icon={<SearchIcon />} 
 *   onClick={() => handleSearch()} 
 *   aria-label="Search"
 * />
 * 
 * // With additional classes
 * <IconButton
 *   icon={<DeleteIcon />}
 *   className="bg-red-500 hover:bg-red-700"
 *   onClick={() => handleDelete(item)}
 *   disabled={isDeleting}
 * />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({ 
    icon, 
    ...props 
}: IconButtonProps): React.JSX.Element => (
    <Button className={clsx(
        'p-4!',
        'group/button',
        'overflow-hidden!',
        'flex justify-center items-center',
        'border! border-gray-300! dark:border-gray-800!',
        'shadow-lg! shadow-inner shadow-white',
        'dark:text-white/85! text-black/85!',
        'font-light',
        'transition-all',
        'duration-250',
        'ease-in-out',
        'rounded-md',
        'focus:outline-none',
        'focus:ring-2!',
        'focus:ring-offset-2!',
        'focus:ring-offset-gray-100!',
        'focus:ring-primary-500!',
        'disabled:opacity-50!',
        'disabled:cursor-not-allowed!',
        'transition!',
        'duration-150!',
        'ease-in-out!',
        props.className,
        props.size === 'sm' && 'mx-2 my-4 px-2 py-1 text-xl',
        props.size === 'md' && 'mx-3 my-6 px-6 py-2 text-2xl',
        props.size === 'lg' && 'mx-4 my-8 px-8 py-3 text-3xl',
        props.variant === 'primary' && 'primary dark:shadow-inner! dark:shadow-gray-600/80! dark:bg-teal-800! hover:dark:bg-teal-900! hover:shadow-teal-900! border-teal-400! dark:border-teal-600!',
        props.variant === 'secondary' && 'bg-gray-600! hover:bg-gray-700! active:bg-gray-800! focus:bg-gray-800!',
        props.variant === 'danger' && 'bg-red-600! hover:bg-red-700! active:bg-red-800! focus:bg-red-800!',
        props.variant === 'warning' && 'bg-yellow-600! hover:bg-yellow-700! active:bg-yellow-800! focus:bg-yellow-800!',
        props.variant === 'success' && 'bg-green-600! hover:bg-green-700! active:bg-green-800! focus:bg-green-800!',
        props.variant === 'info' && 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-800',
        props.disabled && 'opacity-50 cursor-not-allowed',
    )} {...props}>
        {icon}
    </Button>
);