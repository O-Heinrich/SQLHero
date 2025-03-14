import { DockviewApi, IDockviewPanel } from 'dockview';
import * as React from 'react';

const PanelAction = (props: {
    panels: string[];
    api: DockviewApi;
    activePanel?: string;
    panelId: string;
}) => {
    const onClick = () => {
        props.api.getPanel(props.panelId)?.focus();
    };

    React.useEffect(() => {
        const panel = props.api.getPanel(props.panelId);
        if (panel) {
            const disposable = panel.api.onDidVisibilityChange((event) => {
                setVisible(event.isVisible);
            });
            setVisible(panel.api.isVisible);

            return () => {
                disposable.dispose();
            };
        }
    }, [props.api, props.panelId]);

    const [panel, setPanel] = React.useState<IDockviewPanel | undefined>(
        undefined
    );

    React.useEffect(() => {
        const list = [
            props.api.onDidLayoutFromJSON(() => {
                setPanel(props.api.getPanel(props.panelId));
            }),
        ];

        if (panel) {
            const disposable = panel.api.onDidVisibilityChange((event) => {
                setVisible(event.isVisible);
            });
            setVisible(panel.api.isVisible);

            list.push(disposable);
        }

        setPanel(props.api.getPanel(props.panelId));

        return () => {
            list.forEach((l) => l.dispose());
        };
    }, [panel, props.api, props.panelId]);

    const [visible, setVisible] = React.useState<boolean>(true);

    return (
        <div className="button-action">
            <div style={{ display: 'flex' }}>
                <button
                    className={
                        props.activePanel === props.panelId
                            ? 'demo-button selected'
                            : 'demo-button'
                    }
                    onClick={onClick}
                >
                    {props.panelId}
                </button>
            </div>
            <div style={{ display: 'flex' }}>
                <button
                    className="demo-icon-button"
                    onClick={() => {
                        const panel = props.api.getPanel(props.panelId);
                        if (panel) {
                            props.api.addFloatingGroup(panel);
                        }
                    }}
                >
                    <span className="material-symbols-outlined">ad_group</span>
                </button>
                <button
                    className="demo-icon-button"
                    onClick={() => {
                        const panel = props.api.getPanel(props.panelId);
                        if (panel) {
                            props.api.addPopoutGroup(panel);
                        }
                    }}
                >
                    <span className="material-symbols-outlined">
                        open_in_new
                    </span>
                </button>
                <button
                    className="demo-icon-button"
                    onClick={() => {
                        const panel = props.api.getPanel(props.panelId);
                        panel?.api.close();
                    }}
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                <button
                    title="Panel visiblity cannot be edited manually."
                    disabled={true}
                    className="demo-icon-button"
                >
                    <span className="material-symbols-outlined">
                        {visible ? 'visibility' : 'visibility_off'}
                    </span>
                </button>
            </div>
        </div>
    );
};

/**
 * Props interface for Toolbar component
 * 
 * Defines the properties for a container component that displays
 * action buttons and controls in a horizontal bar.
 * 
 * @interface ToolbarProps
 */
export interface ToolbarProps {
    /**
    * Child elements to render within the toolbar
    * Typically consists of buttons, dropdowns, and other control elements
    * 
    * @property {React.ReactNode} children
    */
    children: React.ReactNode;
    /**
    * Optional additional CSS classes to apply to the toolbar container
    * Allows for customization of the toolbar's appearance
    * 
    * @property {string} [className]
    */
    className?: string;
}

export const PanelActions = (props: {
    panels: string[];
    api: DockviewApi;
    activePanel?: string;
}) => {
    return (
        <div className="action-container">
            {props.panels.map((id) => {
                return <PanelAction key={id} {...props} panelId={id} />;
            })}
        </div>
    );
};
