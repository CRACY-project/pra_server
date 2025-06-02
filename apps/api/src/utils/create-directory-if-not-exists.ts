import { existsSync, mkdirSync } from 'fs';

export const createDirectoryIfNotExists = (path: string) => {
    if (existsSync(path)) return;

    mkdirSync(path, { recursive: true });
};
