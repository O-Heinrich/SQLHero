import { DockviewApi } from 'dockview';

export const nextId = (() => {
    let counter = 0;

    return () => counter++;
})();

export function defaultConfig(api: DockviewApi) {
    const editorPanel = api.addPanel({
        id: 'editor',
        component: 'editorPanel',
        renderer: 'always',
        title: 'Editor',
    });

    const lessonPanel = api.addPanel({
        id: 'lesson',
        component: 'lessonPanel',
        title: 'Aufgabenstellung',
    });

    const erdPanel = api.addPanel({
        id: 'erd',
        component: 'erdPanel',
        title: 'ER Diagram',
    });

    api.addGroup({
        id: 'devGrp',
        panels: [editorPanel, lessonPanel],
        direction: 'within',

    });

    api.addGroup({
        id: 'erdGrp',
        panels: [erdPanel],
        direction: 'within',

    });

    editorPanel.api.setActive(lessonPanel);
}
