import { Wrapper } from "./Wrapper";

/**
 * Loading skeleton component displaying animated placeholders
 * 
 * @component
 * @description
 * Renders a loading skeleton with:
 * - Animated pulse effect for loading indication
 * - Theme-aware styling (light/dark mode support)
 * - Accessible with screen reader announcement
 * - Multiple placeholder blocks of varying sizes
 * - Wrapped in consistent layout container
 * 
 * The component follows a content-like structure with:
 * - Large header block (1/3 width)
 * - Subheader block (1/2 width)
 * - Multiple full-width content lines
 * - Shorter final line (1/2 width)
 * 
 * @example
 * ```tsx
 * <Skeleton />
 * ```
 * 
 * @returns {React.ReactElement} Animated skeleton loader
 */
export const Skeleton = () => (
    <Wrapper>
        <div className="flex w-full flex-col gap-2">
            <div className="h-18 w-1/3 mb-8 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-10 w-1/2 my-4 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <div className="h-3.5 w-1/2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true"></div>
            <span className="sr-only">loading</span>
        </div>
    </Wrapper>
);