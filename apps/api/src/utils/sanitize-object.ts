// This function removes ID, null values and values that are objects from an object
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key in obj) {
        if (key === 'id') continue;

        const value = obj[key];
        if (typeof value !== 'object' || value === null) {
            result[key] = value;
        }
    }

    return result;
}
