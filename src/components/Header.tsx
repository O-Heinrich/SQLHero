import React from "react";
import clsx from "clsx";
import { 
    useCanGoBack, 
    useLocation, 
    useNavigate, 
    useRouter,
} from "@tanstack/react-router";
import { APP_NAME } from "@/constants";
import { Wrapper } from "@/components/Wrapper";
import { Logo } from "@/components/Logo";
import { ToggleThemeButton } from "./buttons/ToggleTheme";
import { useTheme } from "@/hooks/useTheme";
import { ChevronLeft, ChevronRight } from "./icons";
import { Button } from "@headlessui/react";
import { COUNT_CHALLENGES } from "@/constants";
import { Ellipses } from "./icons/Ellipses";

/**
 * Represents the properties of the Header component
 */
interface HeaderProps {
    ref?: React.Ref<HTMLHeadingElement>;
}

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
export const Header: React.FC<HeaderProps> = ({ ref }: HeaderProps): React.ReactElement => {
    /**
     * Determines if current theme is dark mode
     * @type {boolean}
     */
    const { theme } = useTheme(); 
    const router = useRouter();
    const canGoBack = useCanGoBack();
    const navigate = useNavigate();
    const location = useLocation();
    
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

    /**
     * Handles navigation to overview page.
     * If already on overview page and can go back, returns to previous page.
     * Otherwise navigates to overview page.
     */
    const handleOverview = () => {
        if (location.pathname === '/overview' && canGoBack) {
            router.history.back();
        } else if (location.pathname !== '/overview') {
            navigate({
                to: '/overview',
            });
        }
    }

    return (
        <header ref={ref} className={clsx('sticky', 'top-0', 'z-50', 'dark:bg-red-500/50', 'bg-red-800/50', 'text-white', 'backdrop-blur-xl')}>
            <Wrapper className={clsx('flex', 'items-center')}>
                <span className={clsx('flex', 'items-center', 'gap-1', 'flex-grow')}>
                    <Logo fill={isDarkMode ? '#efefef' : '#343434'} />
                    <h1 className={clsx('text-4xl', 'dark:text-white/85', 'text-black/85', 'py-4', 'font-light')}>{APP_NAME}</h1>
                </span>
                <div className="px-2 flex">
                    <Button onClick={handlePrev}>
                        <ChevronLeft size={2} fill="currentColor" />
                    </Button>
                    <Button onClick={handleOverview}>
                        <Ellipses size={2} fill="currentColor" />
                    </Button>
                    <Button onClick={handleNext}>
                        <ChevronRight size={2} fill="currentColor" />
                    </Button>
                </div>
                <ToggleThemeButton />
            </Wrapper>
        </header>
    );
};