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
export const Skeleton = (): React.ReactElement => (
    <Wrapper>
        <div className="flex w-full flex-col gap-2">
            <div className="h-18 w-1/3 mb-8 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-10 w-1/2 my-4 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-1/2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <span className="sr-only">loading</span>
        </div>
    </Wrapper>
);

/**
 * Loading skeleton component for index page
 * 
 * @component
 * @description
 * Renders a loading skeleton for the index page including:
 * - Animated placeholders with varying sizes
 * - Theme-aware styling (light/dark mode support)
 * - Wrapped in a layout container
 * - Accessible with screen reader announcement
 * - Two-column layout with image placeholder
 * 
 * @example
 * ```tsx
 * <IndexSkeleton />
 * ```
 * 
 * @returns {React.ReactElement} Animated index skeleton loader
 */
export const IndexSkeleton = (): React.ReactElement => (
    <Wrapper>
        <div className="flex items-center h-full gap-2">
            <div className="flex flex-1 flex-col gap-2">
                <div className="h-18 w-[80%] mb-8 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
                <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
                <div className="h-3.5 w-1/4 mb-4 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />   
                <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
                <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
                <div className="h-3.5 w-full animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
                <div className="h-3.5 w-1/4 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />          
                <div className="h-12 w-24 mt-8 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />      
            </div>
            <div className="w-1/2 h-1/2 max-w-[512px] animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
        </div>
        <span className="sr-only">loading</span>
    </Wrapper>
);

/**
 * Loading skeleton component for challenge page
 * 
 * @component
 * @description
 * Renders a loading skeleton for the challenge page including:
 * - Animated placeholders with varying sizes
 * - Theme-aware styling (light/dark mode support)
 * - Wrapped in a layout container
 * - Accessible with screen reader announcement
 * - Single-column layout with multiple placeholders
 * 
 * @example
 * ```tsx
 * <ChallengeSkeleton />
 * ```
 * 
 * @returns {React.ReactElement} Animated challenge skeleton loader
 */
export const ChallengeSkeleton = (): React.ReactElement => (
    <div className="flex flex-1 inset-0 mt-[calc(var(--spacing)*-20)] mb-[calc(var(--spacing)*-20)]">
        <div className="flex-1 flex flex-col mt-20 pb-22 overflow-auto bg-gray-200/50 dark:bg-slate-900/50">
            <div className="flex-1 gap-2 h-1/2">
                <div className="h-[83%] w-[96%] my-[2%] mx-auto animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true">{/* Editor */}</div>
                <div className="h-[10%] w-[96%] my-[2%] mx-auto animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true">{/* Toolbar */}</div>
            </div>
            <div className="flex-1 pt-8 gap-2 w-full h-1/2 overflow-auto pb-16 border-t-4 border-ridge border-white/20 dark:border-slate-900/20">
                <div className="h-[96%] w-[96%] mx-[2%] mr-[2%] ml-[2%] mx-auto animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30">{/* Table */}</div>
            </div>
        </div>
        <div className="flex-1 px-4 pt-28 pb-22 overflow-auto h-full border-l-4 border-ridge border-white/80 dark:border-slate-900/80">
            <div className="h-18 w-[40%] mb-8 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-1/4 mb-4 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />   
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-full mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
            <div className="h-3.5 w-1/4 mb-2 animate-pulse rounded-radius bg-on-surface/30 dark:bg-on-surface-dark/30" aria-hidden="true" />
        </div>
        <span className="sr-only">loading</span>
    </div>
);