import { reactive, readonly, ref } from 'vue';

import { type AdvancedFilter } from './advanced-filter.types';

export function useAdvancedFilter(params: {
    filters: AdvancedFilter[];
    callback?: (_filters: AdvancedFilter[]) => void;
}) {
    const filters = ref<AdvancedFilter[]>(params.filters || []);

    return readonly(
        reactive({
            filters: filters,
            addFilter: (filter: AdvancedFilter) => {
                filters.value.push(filter);
                if (params.callback) {
                    params.callback(filters.value);
                }
            },
            removeFilter: (index: number) => {
                filters.value.splice(index, 1);
                if (params.callback) {
                    params.callback(filters.value);
                }
            },
            setFilters: (newFilters: AdvancedFilter[]) => {
                filters.value.splice(0, filters.value.length, ...newFilters);
                if (params.callback) {
                    params.callback(filters.value);
                }
            },
            resetFilters: () => {
                filters.value.splice(0, filters.value.length);
                if (params.callback) {
                    params.callback(filters.value);
                }
            },
        })
    );
}

export function createFiltersQuery<T extends AdvancedFilter>({ filters }: { filters: T[] }) {
    const filterQueries: string[] = [];
    for (const filter of filters) {
        const filterQuery = `${filter.field.toString()}::${filter.matchType.toLowerCase()}::${filter.value}`;
        filterQueries.push(filterQuery);
    }

    return filterQueries;
}
