/**
 * @module Controls
 * @description Provides UI control components for the dockview panels, including
 * panel action buttons, toolbar components, and specialized controls for different
 * panel types like ERD panels with zoom functionality.
 */

import { IDockviewHeaderActionsProps } from 'dockview';
import * as React from 'react';
import {
    MagnifyingGlassPlusIcon,
    MagnifyingGlassMinusIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    ArrowDownOnSquareStackIcon,
    ViewfinderCircleIcon,
    XMarkIcon,
    ArrowTopRightOnSquareIcon,
    Bars3BottomRightIcon,
} from '@heroicons/react/24/solid';
import { ToolbarProps } from './panelActions';
import { useTheme } from '@/hooks/useTheme';
import { PanelTypes } from '@/lib/types';
import { useControls } from 'react-zoom-pan-pinch';
import { clsx } from 'clsx';

const SIZE = 'size-6';

/**
 * Icon button component for panel controls
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactElement} props.icon - Icon element to display
 * @param {string} [props.title] - Tooltip text for the icon
 * @param {(event: React.MouseEvent) => void} [props.onClick] - Click handler function
 * @returns {JSX.Element} Rendered icon button
 */
const Icon = (props: {
    icon: React.JSX.Element;
    title?: string;
    onClick?: (event: React.MouseEvent) => void;
}) => {
    return (
        <div 
            title={props.title} 
            role="button" 
            className={clsx('transition-all', 
                'cursor-pointer', 
                'text-slate-600/75 dark:text-slate-200/75',
                'font-light',
                'stroke-0',
                'hover:bg-black/20',
                'hover:dark:bg-white/20',
                'p-2')} 
            onClick={props.onClick}
        >
            <span
                className={SIZE}
                style={{ fontSize: 'inherit' }}
            >
                {props.icon}
            </span>
        </div>
    );
};

/**
 * Map of panel-specific control components keyed by panel ID
 * 
 * @type {Record<string, React.FC>}
 */
const groupControlsComponents: Record<string, React.FC> = {
    panel_1: () => {
        return <ArrowDownOnSquareStackIcon />;
    },
};

/**
 * Right-aligned controls for dockview panel headers
 * 
 * Provides functionality such as:
 * - Zoom in/out for ERD panels
 * - Maximize/minimize panels
 * - Pop-out panels to separate windows
 * 
 * @component
 * @param {IDockviewHeaderActionsProps} props - Dockview header actions properties
 * @returns {JSX.Element} Rendered control components
 */
export const RightControls = (props: IDockviewHeaderActionsProps) => {
    const { theme } = useTheme();
    const { zoomIn, zoomOut } = useControls();
    
    /**
     * Dynamically selected component based on active panel ID
     */
    const Component = React.useMemo(() => {
        if (!props.isGroupActive || !props.activePanel) {
            return null;
        }

        return groupControlsComponents[props.activePanel.id];
    }, [props.isGroupActive, props.activePanel]);

    /**
     * Track whether the current panel group is maximized
     */
    const [isMaximized, setIsMaximized] = React.useState<boolean>(
        props.containerApi.hasMaximizedGroup()
    );

    /**
     * Track whether the current panel is in a popout window
     */
    const [isPopout, setIsPopout] = React.useState<boolean>(
        props.api.location.type === 'popout'
    );

    /**
     * Set up listeners for panel maximization and location changes
     */
    React.useEffect(() => {
        const disposable = props.containerApi.onDidMaximizedGroupChange(() => {
            setIsMaximized(props.containerApi.hasMaximizedGroup());
        });

        const disposable2 = props.api.onDidLocationChange(() => {
            setIsPopout(props.api.location.type === 'popout');
        });

        return () => {
            disposable.dispose();
            disposable2.dispose();
        };
    }, [props.api, props.containerApi]);

    /**
     * Toggle between maximized and normal panel states
     * 
     * @function handleToggleMaxMin
     */
    const handleToggleMaxMin = () => {
        if (props.containerApi.hasMaximizedGroup()) {
            props.containerApi.exitMaximizedGroup();
        } else {
            props.activePanel?.api.maximize();
        }
    };

    /**
     * Handle popping out a panel to a separate window or moving it back
     * Also ensures dark theme is applied to popout windows if needed
     * 
     * @async
     * @function handlePopout
     */
    const handlePopout = async () => {
        if (props.api.location.type !== 'popout') {
            if (await props.containerApi.addPopoutGroup(props.group)) {
                if (theme === 'dark') {
                    const body = props.activePanel?.api.getWindow().document.body;
                    const erd = body?.querySelector('.erd');
                    const src = erd?.getAttribute('src') || '';
                    body?.parentElement?.classList.add('dark');
                    if (!src.endsWith('-dark.svg')) {
                        erd?.setAttribute('src', src.replace('.svg', '-dark.svg'));   
                    }
                }
            }

        } else {
            props.api.moveTo({ position: 'right' });
        }
    };

    /**
     * Handles database schema PDF download
     *
     * Creates and triggers a download for the PDF version of the current challenge's
     * database schema. Extracts the appropriate filename from the schema path,
     * replacing the .sql extension with db.pdf.
     *
     * @function handleDownloadClick
     * @returns {void}
     */
    const handleDownloadClick = (): void => {
        const a = document.createElement('a')
        const file = props.activePanel?.params?.src?.replace('.svg', '.pdf').split('/').pop() ?? ''
        a.href = `/databases/pdf/${file}`
        a.download = file
        a.click()
    }

    return (
        <div
            className="group-control flex"           
        >
            {props.isGroupActive && <ViewfinderCircleIcon />}
            {Component && <Component />}
            {props.activePanel?.view.contentComponent === PanelTypes.ERD && <>
                <Icon
                    title="Vergrössern"                    
                    icon={<MagnifyingGlassPlusIcon className={SIZE} />}
                    onClick={() => zoomIn()}
                />
                <Icon
                    title="Verkleinern"
                    icon={<MagnifyingGlassMinusIcon className={SIZE} />}
                    onClick={() => zoomOut()}
                />
                <Icon
                    title="Download"
                    icon={<ArrowDownOnSquareStackIcon className={SIZE} />}
                    onClick={handleDownloadClick}
                />
            </>}
            {props.activePanel?.view.contentComponent !== PanelTypes.EDITOR && <Icon
                title={isPopout ? 'Fenster schliessen' : 'In neuen Fenster öffnen'}
                icon={isPopout ? <XMarkIcon className={SIZE} /> : <ArrowTopRightOnSquareIcon className={SIZE} />}
                onClick={handlePopout}
            />}
            {!isPopout && (
                <Icon
                    title={isMaximized ? 'Minimieren' : 'Maximieren'}
                    icon={isMaximized ? <ArrowsPointingInIcon className={SIZE} /> : <ArrowsPointingOutIcon className={SIZE} />}
                    onClick={handleToggleMaxMin}
                />
            )}
        </div>
    );
};

/**
 * Prefix header controls component for dockview panels
 * 
 * Displays a hamburger menu icon in the panel header prefix area
 * 
 * @component
 * @param {IDockviewHeaderActionsProps} props - Dockview header actions properties
 * @returns {JSX.Element} Rendered prefix control
 */
export const PrefixHeaderControls = (props: IDockviewHeaderActionsProps) => {
    return (
        <div
            {...props}
            className="group-control"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0px 8px',
                height: '100%',
                color: 'var(--dv-activegroup-visiblepanel-tab-color)',
            }}
        >
            <Icon icon={<Bars3BottomRightIcon />} />
        </div>
    );
};

/**
 * Toolbar component for challenge actions
 * 
 * Provides a consistent styled container for action buttons
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Toolbar content
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Rendered toolbar
 */
export const Toolbar: React.FC<ToolbarProps> = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`bg-gray-200 dark:bg-slate-900/50 flex gap-2 justify-end p-2 ${className ?? ''}`}>
        {children}
    </div>
);