/**
 * @module Header
 * @description 
 * Provides the application header component with navigation controls, theme switching,
 * and challenge navigation capabilities. This module implements a responsive header that adapts 
 * to the current theme and provides navigation between challenges.
 */

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Link, useNavigate } from '@tanstack/react-router';
import { Wrapper } from '@/components/Wrapper';
import { Logo } from '@/components/Logo';
import { ToggleThemeButton } from './buttons/ToggleTheme';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@headlessui/react';
import { COUNT_CHALLENGES, APP_NAME } from 'virtual:sql-hero';
import { useAppState } from '@/hooks/useAppState';
import { AppState, ChallengeAction } from '@/lib/types';
import { useChallengeNumber } from '@/hooks/useChallengeNumber';
import { isFirefox } from '@/lib/agents';
import { IconButton } from './buttons/IconButton';
import { useResizeObserver } from '@/hooks/useResizeObserver';
import { ChevronLeftIcon, ChevronRightIcon, Bars3BottomRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'motion/react';

/**
 * Spacer component properties
 * @interface SpacerProps
 * @property {string} classList - List of CSS classes
 */ 
interface SpacerProps {
    classList?: string;
}

/**
 * Spacer component for header navigation
 * 
 * @component
 * @param {SpacerProps} props - Component properties
 * 
 * @description
 * Renders a vertical spacer with a border line.
 * 
 * @example
 * ```tsx
 * <Spacer classList="mx-2" />
 * ```
 * 
 * @returns {React.ReactElement} Vertical spacer with border line
 */
const Spacer: React.FC<SpacerProps> = ({classList}: SpacerProps): React.ReactElement => <span className={
    `mx-1 w-[1px] h-16 bg-transparent ${classList ?? ''}`
} />;

/**
 * Main application header component
 * 
 * @component
 * @description
 * Renders a sticky header with application branding, navigation controls, and theme toggle.
 * Features:
 * - Displays app logo and name
 * - Provides navigation to overview and introduction pages
 * - Includes challenge navigation controls (previous/next)
 * - Adapts to the current theme (light/dark)
 * - Special handling for Firefox browser
 * - Visual feedback during challenge navigation
 * 
 * The header acts as a central navigation hub and provides context for the current application state.
 * It stores its reference in the application state for success/failure message display.
 * 
 * @returns {React.ReactElement} The application header component
 */
export const Header: React.FC = (): React.ReactElement => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const challengeNo = useChallengeNumber();
    const headerRef = React.useRef<HTMLHeadingElement>(null);
    const blurRef = React.useRef<HTMLDivElement>(null);
    const resizeObserve = useResizeObserver<HTMLDivElement>();
    const { state, dispatch }: { state: AppState, dispatch: React.Dispatch<ChallengeAction> } = useAppState();

    /**
     * Sets header reference in application state
     * 
     * Stores the header DOM element reference in the application state
     * to allow other components to trigger visual feedback on the header.
     * 
     * @effect
     * @dependencies [headerRef, dispatch]
     */
    React.useEffect(() => {
        if (headerRef.current) {
            dispatch({ type: 'SET_HEADER_REF', payload: headerRef.current });
        }
    }, [headerRef, dispatch]);

    useEffect(() => {
        if (state.headerElement) {
            const handleScroll = () => {
                if (window.scrollY > 0) {
                    state.headerElement?.classList.add('shadow-md');
                    state.headerElement?.children[0].classList.add('shadow-md');
                } else {
                    state.headerElement?.classList.remove('shadow-md');
                    state.headerElement?.children[0].classList.remove('shadow-md');
                }
            }

            window.addEventListener('scroll', handleScroll);

            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [state.headerElement]);

    /**
     * Sets up header blur effect for Firefox browser
     * 
     * If the browser is Firefox, sets up a polyfill for the backdrop-blur CSS property
     * to create a frosted glass effect. The blur effect is updated on resize.
     * 
     * @effect
     * @dependencies [isFirefox, headerRef, blurRef, resizeObserve, isMobile]
     */
    useEffect(() => {
        /**
         * Firefox-specific header height synchronization
         * 
         * This effect handles:
         * - Setting initial blur element height to match header
         * - Dynamically updating blur element height on header resize
         * 
         * Only applies when running in Firefox to address browser-specific rendering issues
         * 
         * @remarks
         * - Uses custom resizeObserve hook for tracking header element changes
         * - Synchronizes blur element height with header element
         */
        if (isFirefox && headerRef.current && blurRef.current) {
            const height = headerRef.current.offsetHeight;
            blurRef.current.style.height = `${height}px`;
            resizeObserve(headerRef.current, (entries: ResizeObserverEntry[]) => {
                const { height } = entries[0].contentRect;
                blurRef.current?.style.setProperty('height', `${height}px`);
            });
        }
    }, [headerRef, blurRef, resizeObserve]);


    /**
     * Memoized boolean indicating if dark theme is active
     * 
     * @type {boolean}
     * @default false
     */
    const isDarkMode: boolean = React.useMemo(() => theme === 'dark', [theme]);

    /**
     * Navigates to the next challenge
     * 
     * Calculates the next challenge number, wrapping back to 1 if at the end.
     * Updates header styling to provide visual feedback during navigation.
     * 
     * @function
     */
    const handleNext = () => {
        const next = (challengeNo + 1) % (COUNT_CHALLENGES + 1);
        state.headerElement?.classList.remove('dark:bg-green-500/50', 'bg-green-800/50');
        state.headerElement?.classList.add('dark:bg-red-500/50', 'bg-red-800/50');
        navigate({
            to: '/sql/$number',
            params: {
                number: (next <= 0 ? 1 : next).toString()
            }
        });
    }

    /**
     * Navigates to the previous challenge
     * 
     * Calculates the previous challenge number, wrapping to the last challenge if at the first.
     * Updates header styling to provide visual feedback during navigation.
     * 
     * @function
     */
    const handlePrev = () => {
        const next = challengeNo - 1;
        state.headerElement?.classList.remove('dark:bg-green-500/50', 'bg-green-800/50');
        state.headerElement?.classList.add('dark:bg-red-500/50', 'bg-red-800/50');
        navigate({
            to: '/sql/$number',
            params: {
                number: (next <= 0 ? COUNT_CHALLENGES : next).toString()
            }
        });
    }

    return (
        <>
            {isFirefox && <div ref={blurRef} className="bg-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-[9998]" />}
            <header ref={headerRef} className={clsx('border-b-1 border-gray-100/40 dark:border-gray-100/50  border-groove', 'top-header', 'relative', 'sticky', 'top-0', 'z-[9999]', 'dark:bg-red-500/50', 'bg-red-800/50', 'text-white', !isFirefox && 'backdrop-blur-xl', 'transition-all', 'duration-800', 'dark:mix-blend-color-dodge', 'mix-blend-hard-light')}>
                <div className="transition-all duration-300">
                    <Wrapper className={clsx('flex', 'max-w-400')}>
                        <Link to="/" className="flex items-center gap-2">
                            <Logo fill={isDarkMode ? '#efefef' : 'rgba(0,0,0,.50)'} />
                            <h1 className={clsx('lg:text-4xl', 'md:text-2xl', 'md:inline', 'hidden', 'dark:text-white/85', 'text-black/50', 'py-2', 'font-light')}>
                                {APP_NAME}
                            </h1>
                        </Link>
                        <span className={clsx('flex', 'items-center', 'gap-1', 'flex-grow')}></span>
                        <div className="px-2 flex">
                            <Link to="/overview" className="hidden md:inline">
                                <Button className="h-20">
                                    Übersicht
                                </Button>
                            </Link>
                            <Link to="/introduction" className="hidden md:inline">
                                <Button className="h-20">
                                    Einführung
                                </Button>
                            </Link>
                            {!Number.isNaN(challengeNo) && <Spacer classList="hidden md:inline" />} 
                            <IconButton
                                onClick={handlePrev}
                                disabled={Number.isNaN(challengeNo)}
                                aria-label="Vorherige Herausforderung"
                                className="m-0 px-8!"
                                icon={<ChevronLeftIcon className="size-6" />}
                            />
                            <IconButton
                                onClick={handleNext}
                                disabled={Number.isNaN(challengeNo)}
                                aria-label="Nächste Herausforderung"
                                className="m-0 px-8!"
                                icon={<ChevronRightIcon className="size-6" />}
                            />
                        </div>
                        <ToggleThemeButton />
                        <motion.button 
                            onClick={() => navigate({to: '/overview'})} 
                            className="theme-button m-0! p-2! transition-duration-200! md:hidden"
                            whileTap={{ scale: 0.75 }}
                        >
                            {theme === 'dark' ? <Bars3BottomRightIcon className="size-6 text-white/75!"  /> : <Bars3BottomRightIcon className="size-6 text-black/75"  />}
                        </motion.button>
                    </Wrapper>
                </div>
            </header>
        </>
    );
};