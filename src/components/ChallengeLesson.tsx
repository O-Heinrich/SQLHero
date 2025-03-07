/**
 * @module ChallengeContentModule
 * @description
 * Provides React components for rendering sanitized HTML content in challenges.
 * 
 * Key Features:
 * - Safe HTML rendering using DOMPurify
 * - Separate components for tasks and lessons
 * - Prevents XSS (Cross-Site Scripting) attacks
 * 
 * @requires dompurify
 * @requires react
 */

import React from 'react';
import dompurify from 'dompurify';

/**
 * Props interface for content rendering components
 * @interface ContentProps
 * @description Defines the shape of props for HTML content components
 */
interface ContentProps {
    /** 
     * HTML content to be rendered and sanitized
     * @type {string}
     */
    content: string;
}

/**
 * Challenge task display component with sanitized HTML
 * @component
 * @description Renders HTML task content with XSS protection
 * 
 * @param {ContentProps} props - Component properties
 * @returns {React.ReactElement} Sanitized task content paragraph
 * 
 * @deprecated Use more specific content rendering components
 * @warning Potential future removal
 * 
 * @example
 * ```tsx
 * <ChallengeTask task="<p>Complete the SQL query</p>" />
 * ```
 */
export const ChallengeTask: React.FC<{ task: string }> = ({ task }: { task: string }) => (
    <p
        dangerouslySetInnerHTML={{
            // Sanitize HTML to prevent XSS attacks
            __html: dompurify.sanitize(task)
        }}
    />
);

/**
 * Challenge lesson display component with sanitized HTML
 * @component
 * @description Renders HTML lesson content with XSS protection and additional styling
 * 
 * @param {ContentProps} props - Component properties
 * @returns {React.ReactElement} Sanitized lesson content div
 * 
 * @example
 * ```tsx
 * <ChallengeLesson lesson="<h2>SQL Basics</h2><p>Learn about databases...</p>" />
 * ```
 */
export const ChallengeLesson: React.FC<{ lesson: string }> = ({
    lesson
}: {
    lesson: string;
}) => (
    <div className="mt-24"
        dangerouslySetInnerHTML={{
            // Sanitize HTML to prevent XSS attacks
            __html: dompurify.sanitize(lesson)
        }}
    />
);