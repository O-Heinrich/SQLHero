/**
 * @module Footer
 * @description 
 * Provides the application footer component with responsive theming
 * and branding elements that adapt to the current application theme.
 */
import dompurify from 'dompurify';

/**
 * Challenge task display component with sanitized HTML
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.task - HTML task content
 * @deprecated
 */
export const ChallengeTask: React.FC<{ task: string }> = ({ task }: { task: string }) => (
    <p
        dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(task)
        }}
    />
);

/**
 * Challenge lesson display component with sanitized HTML
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.lesson - HTML lesson content
 */
export const ChallengeLesson: React.FC<{ lesson: string }> = ({
    lesson
}: {
    lesson: string;
}) => (
    <div className="mt-24"
        dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(lesson)
        }}
    />
);