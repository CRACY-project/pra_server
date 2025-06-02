import type { App } from 'vue';

const iconModules = import.meta.glob(['../icons/*.vue'], {
    eager: true,
});

const modules = import.meta.glob('./*.vue', { eager: true });

export const registerGlobalComponent = (app: App<Element>) => {
    for (const path in modules) {
        app.component(path.replace('./', '').replace('.vue', ''), (modules[path] as { default: any }).default);
    }

    for (const path in iconModules) {
        const items = path.split('/');
        const lastItem = items[items.length - 1].replace('.vue', '');
        app.component(
            `${lastItem.charAt(0).toUpperCase()}${lastItem.slice(1)}`,
            (iconModules[path] as { default: any }).default
        );
    }
};
