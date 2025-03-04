import {
    DockviewReact,
    DockviewReadyEvent,
    IDockviewPanelHeaderProps,
    IDockviewPanelProps,
} from 'dockview';
import { useEffect, useState } from 'react';

import '@/assets/dockview.css';

interface MainViewProps {
    theme?: string;
}

interface CustomParams {
    myValue: number;
}

const DefaultComponent: React.FC<IDockviewPanelProps<CustomParams>> = (props: IDockviewPanelProps<CustomParams>): React.ReactElement => {
    const [running, setRunning] = useState<boolean>(false);

    useEffect(() => {
        if (!running) {
            return;
        }

        const interval = setInterval(() => {
            props.api.updateParameters({ myValue: Date.now() });
        }, 1000);
        props.api.updateParameters({ myValue: Date.now() });
        return () => {
            clearInterval(interval);
        };
    }, [props.api, running]);

    return (
        <div style={{ height: '100%', padding: '20px', color: 'white' }}>
            <div>{props.api.title}</div>
            <button onClick={() => setRunning(!running)}>
                {running ? 'Stop' : 'Start'}
            </button>
            <span>{`value: ${props.params.myValue}`}</span>
        </div>
    );
}

const components = { 
    default: DefaultComponent,
};

const tabComponents = {
    default: (props: IDockviewPanelHeaderProps<CustomParams>) => {
        return (
            <div>
                <div>{`custom tab: ${props.api.title}`}</div>
                <span>{`value: ${props.params.myValue}`}</span>
            </div>
        );
    },
};

export const MainView: React.FC<MainViewProps> = (props: MainViewProps) => {
    const onReady = (event: DockviewReadyEvent) => {
        event.api.addPanel({
            id: 'panel_1',
            component: 'default',
            tabComponent: 'default',
            params: {
                myValue: Date.now(),
            },
        });

        event.api.addPanel({
            id: 'panel_2',
            component: 'default',
            tabComponent: 'default',
            params: {
                myValue: Date.now(),
            },
        });
    };
    return (
        <DockviewReact

            components={components}
            tabComponents={tabComponents}
            onReady={onReady}
            className={props.theme || 'dockview-theme-abyss'}
        />
    );
}

