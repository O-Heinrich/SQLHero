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
     * Optional additional CSS classes to apply to the button
     * Will be merged with the default 'icon' class
     */
    className?: string;
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
    className, 
    ...props 
}: IconButtonProps): React.JSX.Element => (
    <Button className={clsx('icon', className && className)} {...props}>
        {icon}
    </Button>
);