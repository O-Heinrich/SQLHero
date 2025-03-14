import { DockviewApi } from 'dockview';

export const nextId = (() => {
    let counter = 0;

    return () => counter++;
})();

export function defaultConfig(api: DockviewApi, handleExecuteClick: () => void) {

    const editorPanel = api.addPanel({
        id: `editor-${nextId()}`,
        title: 'SQL Editor',
        component: 'editorPanel',
        params: {
            handleExecuteClick,
        },
    });

    api.addPanel({
        id: 'erd',
        component: 'erdPanel',
        title: 'ER Diagram',
        position: {
            referencePanel: editorPanel,
            direction: 'left',
        },
    });

    api.addPanel({
        id: 'lesson',
        component: 'lessonPanel',
        title: 'Aufgabenstellung',
        position: {
            referencePanel: editorPanel,
            direction: 'below',
        },
    });

    editorPanel.api.setActive();
}
