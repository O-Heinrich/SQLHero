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

const Icon = (props: {
    icon: React.ReactElement;
    title?: string;
    onClick?: (event: React.MouseEvent) => void;
}) => {
    return (
        <div title={props.title} role="button" className="action" onClick={props.onClick}>
            <span
                style={{ fontSize: 'inherit' }}
            >
                {props.icon}
            </span>
        </div>
    );
};

const groupControlsComponents: Record<string, React.FC> = {
    panel_1: () => {
        return <ArrowDownOnSquareStackIcon />;
    },
};

export const RightControls = (props: IDockviewHeaderActionsProps) => {
    const { theme } = useTheme();
    const { zoomIn, zoomOut } = useControls();
    const Component = React.useMemo(() => {
        if (!props.isGroupActive || !props.activePanel) {
            return null;
        }

        return groupControlsComponents[props.activePanel.id];
    }, [props.isGroupActive, props.activePanel]);

    const [isMaximized, setIsMaximized] = React.useState<boolean>(
        props.containerApi.hasMaximizedGroup()
    );

    const [isPopout, setIsPopout] = React.useState<boolean>(
        props.api.location.type === 'popout'
    );

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

    const handleToggleMaxMin = () => {
        if (props.containerApi.hasMaximizedGroup()) {
            props.containerApi.exitMaximizedGroup();
        } else {
            props.activePanel?.api.maximize();
        }
    };

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

    return (
        <div
            className="group-control"
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0px 8px',
                gap: '8px',
                height: '100%',
                color: 'var(--dv-activegroup-hiddenpanel-tab-color)',
            }}
        >
            {props.isGroupActive && <ViewfinderCircleIcon />}
            {Component && <Component />}
            {props.activePanel?.view.contentComponent === PanelTypes.ERD && <>
                <Icon
                    title="Vergrössern"
                    icon={<MagnifyingGlassPlusIcon className="size-6 cursor-pointer" />}
                    onClick={() => zoomIn()}
                />
                <Icon
                    title="Verkleinern"
                    icon={<MagnifyingGlassMinusIcon className="size-6 cursor-pointer" />}
                    onClick={() => zoomOut()}
                />
                <Icon
                    title={isPopout ? 'Fenster schliessen' : 'In neuen Fenster öffnen'}
                    icon={isPopout ? <XMarkIcon className="size-6 cursor-pointer" /> : <ArrowTopRightOnSquareIcon className="size-6 cursor-pointer" />}
                    onClick={handlePopout}
                />
            </>}
            {!isPopout && (
                <Icon
                    title={isMaximized ? 'Minimieren' : 'Maximieren'}
                    icon={isMaximized ? <ArrowsPointingInIcon className="size-6" /> : <ArrowsPointingOutIcon className="size-6" />}
                    onClick={handleToggleMaxMin}
                />
            )}
        </div>
    );
};

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
            <Icon icon={<Bars3BottomRightIcon className="size-4" />} />
        </div>
    );
};

/**
 * Toolbar component for challenge actions
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Toolbar content
 * @param {string} [props.className] - Additional CSS classes
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