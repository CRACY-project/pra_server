/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function filterMapper<T>(args: any[], supportedRelationalFilters?: string[]): T {
    const mappedFilters: any[] = [];
    for (const arg of args) {
        if (
            arg.path &&
            supportedRelationalFilters &&
            !supportedRelationalFilters.includes(`${arg.path}.${arg.field}`)
        ) {
            continue;
        }

        if (arg.matchType.includes('_BOOLEAN')) {
            arg.matchType = arg.matchType.replace('_BOOLEAN', '');
            arg.value = arg.value === 'true';
        }

        if (arg.matchType.includes('_NUMBER')) {
            arg.matchType = arg.matchType.replace('_NUMBER', '');
            arg.value = +arg.value;
        }

        if (arg.path) {
            const query = {};
            const pathParts = arg.path.split('.');

            nestedQueryGenerator(query, pathParts, arg);

            mappedFilters.push(query);
            continue;
        }

        mappedFilters.push({
            [arg.field]: {
                [arg.matchType.toLowerCase()]: arg.value,
            },
        });
    }

    return { AND: mappedFilters } as T;
}

function nestedQueryGenerator(query: any, pathParts: string[], arg: any) {
    const pathPart = pathParts[0];
    query[pathPart] = {};
    pathParts.shift();

    if (pathParts.length) {
        nestedQueryGenerator(query[pathPart], pathParts, arg);
    } else {
        query[pathPart] = {
            [arg.field]: {
                [arg.matchType.toLowerCase()]: arg.value,
            },
        };
    }
}
