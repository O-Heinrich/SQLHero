import React from "react";
import clsx from "clsx";
import {
    Link,
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
import { 
    Button, 
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuItems 
} from "@headlessui/react";
import { COUNT_CHALLENGES } from "@/constants";
import { Ellipses } from "./icons/Ellipses";
import { useAppState } from "@/hooks/useAppState";
import { ChallengeAction } from "@/lib/types";

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
    const router = useRouter();
    const canGoBack = useCanGoBack();
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

    /**
     * Handles navigation to link.
     * Shorthand function to navigate to URL path.
     * 
     * @param {string} link - URL path to navigate
     * @returns {Promise<void>}
     * @see useNavigate
     */ 
    const handleLnkClk = (link: string): Promise<void> => navigate({
        to: link,
    });   

    return (
        <header ref={headerRef} className={clsx('sticky', 'top-0', 'z-50', 'dark:bg-red-500/50', 'bg-red-800/50', 'text-white', 'backdrop-blur-xl')}>
            <Wrapper className={clsx('flex', 'items-center')}>
                <span className={clsx('flex', 'items-center', 'gap-1', 'flex-grow')}>
                    <Logo fill={isDarkMode ? '#efefef' : '#343434'} />
                    <h1 className={clsx('lg:text-4xl', 'md:text-2xl', 'md:inline', 'hidden', 'dark:text-white/85', 'text-black/85', 'py-4', 'font-light')}>
                        <Link to="/">
                            {APP_NAME}
                        </Link>
                    </h1>
                </span>
                <div className="px-2 flex">
                    <Button onClick={handlePrev} disabled={Number.isNaN(challengeNo)}>
                        <ChevronLeft size={2} fill="currentColor" />
                    </Button>
                    <Menu>
                        <MenuButton className="inline-flex items-center gap-2">
                            <Ellipses size={2} fill="currentColor" />
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor="bottom end"
                            className="navigation z-100 bg-red-500/50 dark:bg-red-500/50 backdrop-blur-md shadow-xl rounded-b-lg origin-top-right transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <MenuItem>
                                <Button onClick={handleOverview}>
                                    {location.pathname === '/overview' && canGoBack ? 'Zurück' : 'Übersicht'}
                                </Button>
                            </MenuItem>
                            <div className="h-px bg-gray-500/50 dark:bg-white/25" />
                            <MenuItem>
                                <Button onClick={() => handleLnkClk('/introduction')}>
                                    Einführung
                                </Button>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                    <Button onClick={handleNext} disabled={Number.isNaN(challengeNo)}>
                        <ChevronRight size={2} fill="currentColor" />
                    </Button>
                </div>
                <ToggleThemeButton />
            </Wrapper>
        </header>
    );
};