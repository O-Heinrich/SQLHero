/**
 * @module DbIllustration
 * @description
 * A theme-aware database illustration component that provides
 * an 3D-transformed image with dynamic styling based
 * on the current theme mode.
 */

import pgImage from '@/assets/pg.svg';

/**
 * Props for the DbIllustration component
 * @interface
 * @extends {React.HTMLProps<HTMLImageElement>} - Inherits standard HTML image attributes
 * @property {boolean} isDarkMode               - Indicates whether the dark theme is active
 *                                                Used to adjust visual effects for optimal visibility
 */
interface DbIllustrationProps extends React.HTMLProps<HTMLImageElement> {
    isDarkMode: boolean;
}

/**
 * Database Illustration Component
 * @component
 * @description
 * Renders a responsive database illustration with theme-aware styling
 * and 3D transform effects. The component automatically adjusts its
 * visual appearance based on the current theme mode.
 * 
 * Features:
 * - Responsive sizing (200px - 400px)
 * - Theme-aware blend modes and shadows
 * - 3D transform
 * - Smooth transitions
 * 
 * Visual effects include:
 * - Dark mode: color-dodge blend + dark shadow
 * - Light mode: multiply blend + light shadow
 * - 3D perspective transform with rotation
 * 
 * @param {DbIllustrationProps} props - Component properties
 * @param {boolean} props.isDarkMode - Theme mode flag
 * @returns {React.ReactElement} Rendered illustration
 * 
 * @example
 * ```tsx
 * <DbIllustration isDarkMode={theme === 'dark'} />
 * ```
 */
export const DbIllustration: React.FC<DbIllustrationProps> = (
    { isDarkMode }: DbIllustrationProps
): React.ReactElement => (
    <img
        src={pgImage}
        alt="SQL Hero"
        width="400"
        height="auto"
        className="md:min-w-[200px] md:max-w-[400px] flex-1 max-w-[250px]"
        style={{
            // Theme-dependent blend mode for optimal visibility
            mixBlendMode: isDarkMode ? 'color-dodge' : 'multiply',

            // Theme-dependent shadow effect
            filter: isDarkMode
                ? 'drop-shadow(rgba(0 0 0 / 60%) -0.2em -1em 1.2em)'
                : 'drop-shadow(rgb(128 128 128 / 40%) -0.2em -1em 1.2em)',

            // 3D transform properties for logo animation
            perspective: '200px',
            perspectiveOrigin: '250% 50%',
            transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
            transform: 'perspective(1200px) translate3d(20px, 20px, 400px) rotate3d(100, 0.2, -0.1, 330deg)',
        }}
    />
);