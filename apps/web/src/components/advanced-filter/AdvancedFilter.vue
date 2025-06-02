<template>
    <div ref="target">
        <div class="ml-2 flex">
            <AdvancedFilterButton @click.stop="show = !show" />
            <div class="flex flex-wrap space-x-2">
                <AdvancedFilterChip
                    v-for="(filter, i) in filters"
                    :key="`filterChip${i}`"
                    class="my-1.5"
                    :title="filter.value.length > 5 ? getTooltip(filter) : null"
                    @remove-filter="removeFilter(i)"
                >
                    <template #field>{{ getFieldLabel(filter.field.toString()) }}</template>
                    <template #matchType>{{ getMatchLabel(filter.matchType).toLowerCase() }}</template>
                    <template #value>{{ formatValue(filter.value, filter.field.toString()) }}</template>
                </AdvancedFilterChip>
                <AdvancedFilterReset v-if="filters.length > 0" class="my-1.5" @reset-filter="resetFilters()" />
            </div>
        </div>
        <AdvancedFilterPopover
            v-if="show"
            :show="show"
            :fields="fields"
            :filters="filters"
            @submit="filters => submitFilters(filters)"
        />
    </div>
</template>
<script lang="ts" setup>
    import { notify } from '@kyvg/vue3-notification';
    import { onClickOutside } from '@vueuse/core';
    import { ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import AdvancedFilterReset from '@/components/advanced-filter/AdvancedFilterReset.vue';

    import { createFiltersQuery, useAdvancedFilter } from './advanced-filter';
    import {
        type AdvancedFilter,
        type AdvancedFilterField,
        type AdvancedFilterMatchType,
        matchTypes,
    } from './advanced-filter.types';
    import AdvancedFilterButton from './AdvancedFilterButton.vue';
    import AdvancedFilterChip from './AdvancedFilterChip.vue';
    import AdvancedFilterPopover from './AdvancedFilterPopover.vue';
    const route = useRoute();

    interface IProps {
        fields: AdvancedFilterField[];
    }

    const router = useRouter();

    const props = defineProps<IProps>();

    const show = ref<boolean>(false);
    const target = ref(null);
    const emit = defineEmits(['submit']);

    onClickOutside(target, () => (show.value = false));

    const getFieldLabel = (fieldName: string) => {
        const field = props.fields.filter(field => field.value === fieldName)[0];

        return field.label;
    };

    const getMatchLabel = (matchType: string) => {
        const allMatchTypes = Object.values(matchTypes).flat();
        const type = allMatchTypes.filter(type => type.value === matchType)[0];

        return type.label;
    };

    const formatValue = (value: string, fieldName: string, shorten = true) => {
        const field = props.fields.find(field => field.value === fieldName);

        if (field?.type === 'date') {
            const date = new Date(value);
            return date.toLocaleString();
        }

        return value.length > 5 && shorten ? value.substring(0, 5).concat('...') : value;
    };

    const processFilters = (filtersData: AdvancedFilter[]) => {
        filtersData = filtersData.filter(filter => filter.value?.length > 0);
        const filtersCopy = JSON.parse(JSON.stringify(filtersData));
        filtersCopy.forEach((filter: any, i: number) => {
            const field = props.fields.filter(field => field.value === filter.field)[0];
            if (field.type === 'date') {
                filtersCopy[i].value = new Date(filtersCopy[i].value).toISOString();
            }
            if (field.path) {
                filtersCopy[i].path = field.path;
            }
        });

        return filtersCopy;
    };

    const filtersChanged = (filtersData: AdvancedFilter[]) => {
        const processedFilters = processFilters(filtersData);
        emit('submit', processedFilters);
        show.value = false;
        updateURL();
    };

    const updateURL = () => {
        const url = new URL(route.fullPath, window.location.origin);
        url.searchParams.delete('filter');
        const filterQueries = createFiltersQuery<any>({ filters: filters as AdvancedFilter[] });
        for (const filterQuery of filterQueries) {
            url.searchParams.append('filter', filterQuery);
        }
        router.push(url.toString().split(window.location.origin)[1]);
    };

    const validateFilter = (filter: AdvancedFilter) => {
        let isValid = false;
        if (filter.value === undefined) {
            return isValid;
        }

        for (const field of props.fields) {
            if (field.value !== filter.field) continue;

            if (!Object.keys(matchTypes).includes(field.type)) continue;
            const matchTypesForField = matchTypes[field.type as keyof typeof matchTypes];
            const matchTypesValues = matchTypesForField.map(type => type.value);

            if (!matchTypesValues.includes(filter.matchType)) break;

            isValid = true;
            break;
        }

        return isValid;
    };

    const submitFilters = (filters: AdvancedFilter[]) => {
        filters = filters.filter(filter => !(filter?.value === null || filter?.value === undefined));
        for (const filter of filters) {
            if (!validateFilter(filter)) {
                notify({
                    text: 'Please check your filters and try again.',
                    type: 'error',
                });
                return;
            }
        }
        setFilters(filters);
    };

    const getFiltersFromURL = () => {
        if (!route.query.filter) return [];

        const filtersQuery = Array.isArray(route.query.filter)
            ? (route.query.filter as string[])
            : ([route.query.filter] as string[]);
        const parsedFilters: AdvancedFilter[] = [];

        filtersQuery?.forEach(filterQuery => {
            const filter = filterQuery.split('::');

            if (filter.length !== 3) return;

            const mappedFilter: AdvancedFilter = {
                field: filter[0],
                matchType: filter[1].toUpperCase() as AdvancedFilterMatchType,
                value: filter[2],
            };

            const isFilterValid = validateFilter(mappedFilter);

            if (isFilterValid) parsedFilters.push(mappedFilter);
        });

        return parsedFilters;
    };

    const getTooltip = (filter: AdvancedFilter) => {
        const fieldLabel = getFieldLabel(filter.field.toString());
        const matchLabel = getMatchLabel(filter.matchType).toLowerCase();
        const value = formatValue(filter.value, filter.field.toString(), false);

        return `${fieldLabel}: ${matchLabel} "${value}"`;
    };

    const initialFilters = processFilters(getFiltersFromURL());
    const { filters, removeFilter, setFilters, resetFilters } = useAdvancedFilter({
        filters: initialFilters || [],
        callback: filtersChanged,
    });
    emit('submit', filters);

    watch(
        () => ({ ...route }),
        () => {
            const filters = processFilters(getFiltersFromURL());
            setFilters(filters);
        }
    );
</script>
