import { resolve } from 'path';

export const checkIfFileNameIsSafe = (path: string, fileName: string) => {
    const actualDirectory = resolve(path, fileName);
    const expectedDirectory = `${path}/${fileName}`;

    return actualDirectory === expectedDirectory;
};
