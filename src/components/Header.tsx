import React from "react";
import clsx from "clsx";
import {
    Link,
    useLocation,
    useNavigate,
} from "@tanstack/react-router";
import { APP_NAME } from "@/constants";
import { Wrapper } from "@/components/Wrapper";
import { Logo } from "@/components/Logo";
import { ToggleThemeButton } from "./buttons/ToggleTheme";
import { useTheme } from "@/hooks/useTheme";
import { ChevronLeft, ChevronRight } from "./icons";
import { Button } from "@headlessui/react";
import { COUNT_CHALLENGES } from "@/constants";
import { useAppState } from "@/hooks/useAppState";
import { ChallengeAction } from "@/lib/types";

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
 * Header component with navigation and theme-responsive design
 * 
 * @component
 * @param {HeaderProps} props - Component properties
 * @param {React.Ref<HTMLHeadingElement>} [props.ref] - Optional ref for header element
 * 
 * @description
 * Renders a sticky header with:
 * - Logo and application name
 * - Navigation links
 * - Theme toggle button
 * - Dynamic styling based on current theme
 * 
 * @example
 * ```tsx
 * <Header />
 * ```
 * 
 * @returns {React.ReactElement} Themed and responsive header
 */
export const Header: React.FC = (): React.ReactElement => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const headerRef = React.useRef<HTMLHeadingElement>(null);
    const { dispatch }: { dispatch: React.Dispatch<ChallengeAction> } = useAppState();

    /**
     * Sets header reference for handling success messages
     */
    React.useEffect(() => {
        if (headerRef.current) {
            dispatch({ type: 'SET_HEADER_REF', payload: headerRef.current });
        }
    }, [headerRef, dispatch]);

    /**
     * Checks if current theme is dark mode
     * @type {boolean} True if dark mode, false otherwise
     * @default false
     * @see useTheme
     */
    const isDarkMode: boolean = React.useMemo(() => theme === 'dark', [theme]);

    /**
     * Extracts challenge number from URL path
     * @type {number}
     * @default 1
     */
    const challengeNo: number = React.useMemo(() => {
        const path = location.pathname.split('/').pop();
        return parseInt(path ?? '1', 10);
    }, [location.pathname]);

    /**
     * Handles navigation to next challenge.
     * Cycles through challenges 1 to COUNT_CHALLENGES.
     * If at last challenge, wraps back to challenge 1.
     */
    const handleNext = () => {
        const next = (challengeNo + 1) % (COUNT_CHALLENGES + 1);
        navigate({
            to: '/challenges/$name',
            params: {
                name: (next <= 0 ? 1 : next).toString()
            }
        });
    }
    /**
     * Handles navigation to previous challenge.
     * Goes to previous challenge number.
     * If at challenge 1, wraps to last challenge.
     */
    const handlePrev = () => {
        const next = challengeNo - 1;
        navigate({
            to: '/challenges/$name',
            params: {
                name: (next <= 0 ? COUNT_CHALLENGES : next).toString()
            }
        });
    }

    return (
        <header ref={headerRef} className={clsx('sticky', 'top-0', 'z-50', 'dark:bg-red-500/50', 'bg-red-800/50', 'text-white', 'backdrop-blur-xl')}>
            <Wrapper className={clsx('flex', 'items-center', 'max-w-400')}>
                <span className={clsx('flex', 'items-center', 'gap-1', 'flex-grow')}>
                    <Logo fill={isDarkMode ? '#efefef' : '#343434'} />
                    <h1 className={clsx('lg:text-4xl', 'md:text-2xl', 'md:inline', 'hidden', 'dark:text-white/85', 'text-black/85', 'py-4', 'font-light')}>
                        <Link to="/">
                            {APP_NAME}
                        </Link>
                    </h1>
                </span>
                <div className="px-2 flex items-center">
                    <Link to="/overview" className="hidden md:inline">
                        <Button>
                            Übersicht
                        </Button>
                    </Link>
                    <Link to="/introduction" className="hidden md:inline">
                        <Button>
                            Einführung
                        </Button>
                    </Link>
                    {!Number.isNaN(challengeNo) && <Spacer classList="hidden md:inline" />} 
                    <Button onClick={handlePrev} disabled={Number.isNaN(challengeNo)}>
                        <ChevronLeft size={2} fill="currentColor" />
                    </Button>
                    <Button onClick={handleNext} disabled={Number.isNaN(challengeNo)}>
                        <ChevronRight size={2} fill="currentColor" />
                    </Button>
                </div>
                <ToggleThemeButton />
            </Wrapper>
        </header>
    );
};