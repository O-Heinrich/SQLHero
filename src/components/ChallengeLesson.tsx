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
export const ChallengeLesson: React.FC<{ 
    lesson: string, 
    difficulty: 'easy' | 'medium' | 'hard' | 'unknown',
    ref?: React.RefObject<HTMLDivElement|null>
}> = ({
    lesson,
    difficulty,
    ref,
}: {
    lesson: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
    ref?: React.RefObject<HTMLDivElement|null>
}): React.ReactElement => (
    <article className="mt-4">
        <div 
            className="pb-4"
            ref={ref}
            dangerouslySetInnerHTML={{
                __html: `
                <span class="float-right inline-block rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    ${dompurify.sanitize(difficulty)}
                </span>\n
                ${dompurify.sanitize(lesson)}
                `
            }}
        />
    </article>
);