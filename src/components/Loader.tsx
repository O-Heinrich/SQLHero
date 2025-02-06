import ContentLoader from "react-content-loader";
import { Wrapper } from "./Wrapper";
import { useTheme } from "@/hooks/useTheme";

/**
 * A skeleton loading component that displays a placeholder UI while content is being loaded.
 * The component adapts to the current theme (light/dark) for better visual integration.
 * 
 * @component
 * @returns {JSX.Element} A skeleton loading animation with theme-aware styling
 * 
 * @example
 * // Basic usage
 * <Loading />
 * 
 * @example
 * // Usage within a container
 * <div className="content-container">
 *   <Loading />
 * </div>
 * 
 * @description
 * This component uses `react-content-loader` to create a skeleton loading effect.
 * It automatically adapts its background and foreground colors based on the current theme
 * (light or dark) using the `useTheme` hook. The skeleton consists of multiple rectangular
 * placeholders simulating typical content loading patterns.
 * 
 * @see {@link https://github.com/danilowoz/react-content-loader} for more details on the loader.
 * @see {@link useTheme} for theme management details.
 */
export const Loading = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <Wrapper>
            <ContentLoader
                width="100%"
                height={900}
                backgroundColor={isDark ? '#333' : '#f5f5f5'}
                foregroundColor={isDark ? '#555' : '#dbdbdb'}
                animate={true}
            >
                <rect x="0" y="0" rx="3" ry="3" width="250" height="3.75rem" />
                <rect x="10" y="4rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="5.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="7rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="8.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="10rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="11.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="13rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="14.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="16rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="17.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="19rem" rx="3" ry="3" width="100%" height="1.25rem" />
            </ContentLoader>
        </Wrapper>
    );
}
