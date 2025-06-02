<template>
    <TransitionRoot
        as="template"
        :show="show"
        enter="duration-100 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-100 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
    >
        <div
            class="absolute left-1/2 right-0 z-50 max-h-screen w-[90vw] -translate-x-1/2 space-y-4 overflow-auto rounded-md border bg-white p-4 drop-shadow-lg dark:bg-dark-400 sm:left-auto sm:right-auto sm:ml-2 sm:w-[40vw] sm:translate-x-0"
        >
            <FormKit v-slot="{ items, node, value: filters }" v-model="newFilters" type="list" dynamic>
                <div class="flex max-h-[70vh] flex-col gap-7 overflow-y-auto sm:max-h-[50vh]">
                    <FormKit v-for="(filter, index) in items" :key="filter" type="group" :index="index">
                        <div class="grid w-full grid-cols-1 items-end gap-4 sm:grid-cols-10">
                            <FormKit
                                type="select"
                                :options="fieldsOptions"
                                label="Property"
                                name="field"
                                popover
                                outer-class="w-full sm:col-span-3"
                                :deselect="false"
                                :data-testid="`filter-property-${index}`"
                                @input="
                                    newField => {
                                        const matchTypesForField = getMatchTypes(newField as string);
                                        const currentFilter = getFilterByIndex(newFilters, index);
                                        currentFilter.matchType = matchTypesForField[0]
                                            .value as AdvancedFilterMatchType;
                                        node.input(newFilters);
                                    }
                                "
                            />
                            <FormKit
                                type="select"
                                :options="getMatchTypes(getFilterByIndex(filters, index).field.toString())"
                                label="Match type"
                                name="matchType"
                                popover
                                :data-testid="`filter-match-type-${index}`"
                                :deselect="false"
                                outer-class="w-full sm:col-span-3"
                            />
                            <FormKit
                                v-if="getFieldType(getFilterByIndex(newFilters, index).field.toString()) === 'dropdown'"
                                type="select"
                                :options="getFieldOptions(getFilterByIndex(newFilters, index).field.toString())"
                                label="Value"
                                name="value"
                                popover
                                :data-testid="`filter-value-${index}`"
                                outer-class="w-full sm:col-span-3"
                            />
                            <FormKit
                                v-else
                                :type="getFieldType(getFilterByIndex(newFilters, index).field.toString())"
                                label="Value"
                                name="value"
                                :data-testid="`filter-value-${index}`"
                                outer-class="w-full sm:col-span-3"
                            />
                            <div @click="deleteFilter(filters, index)">
                                <XMarkIcon
                                    class="mb-2 h-6 w-6 cursor-pointer font-bold text-black hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </FormKit>
                </div>

                <div class="flex flex-row justify-between">
                    <div
                        class="cursor-pointer rounded-md border p-2 hover:bg-gray-100 dark:bg-dark-200 dark:hover:bg-dark-100"
                        data-testid="filter-add"
                        @click="
                            () => {
                                const newFilter = createNewFilter();
                                node.input(newFilters.concat(newFilter));
                            }
                        "
                    >
                        <PlusIcon
                            class="h-5 w-5 font-bold text-black hover:text-gray-700 dark:text-gray-300"
                            aria-hidden="true"
                        />
                    </div>
                    <Button @click="$emit('submit', newFilters as AdvancedFilter[])">Apply</Button>
                </div>
            </FormKit>
        </div>
    </TransitionRoot>
</template>
<script lang="ts" setup>
    import { TransitionRoot } from '@headlessui/vue';
    import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';
    import { computed, ref } from 'vue';
    import { onBeforeMount } from 'vue';

    import {
        type AdvancedFilter,
        type AdvancedFilterField,
        type AdvancedFilterMatchType,
        fieldTypes,
        matchTypes,
    } from './advanced-filter.types';

    interface IProps {
        show: boolean;
        fields: AdvancedFilterField[];
        filters: readonly AdvancedFilter[];
    }
    const props = withDefaults(defineProps<IProps>(), {
        show: false,
    });
    defineEmits<{ submit: [filters: AdvancedFilter[]] }>();

    const fieldsOptions = computed(() => props.fields.map(field => ({ label: field.label, value: field.value })));

    const getMatchTypes = (fieldToBeMatched: string) => {
        const field = props.fields.find(field => field.value === fieldToBeMatched);
        if (!field) {
            return [];
        }
        if (Object.keys(matchTypes).includes(field.type)) {
            return matchTypes[field.type as keyof typeof matchTypes];
        }

        return [];
    };

    const getFieldType = (fieldToBeMatched: string) => {
        const field = props.fields.find(field => field.value === fieldToBeMatched);
        if (!field) {
            return [];
        }
        if (Object.keys(fieldTypes).includes(field.type)) {
            return fieldTypes[field.type as keyof typeof fieldTypes];
        }

        return 'text';
    };

    const getFieldOptions = (fieldToBeMatched: string) => {
        const field = props.fields.find(field => field.value === fieldToBeMatched);
        return field?.options ?? [];
    };

    const newFilters = ref<Partial<AdvancedFilter>[]>([
        {
            field: props.fields[0].value,
            matchType: getMatchTypes(props.fields[0].value)[0].value as AdvancedFilterMatchType,
            value: undefined,
        },
    ]);

    onBeforeMount(() => {
        if (props.filters && props.filters.length > 0) {
            newFilters.value = JSON.parse(JSON.stringify(props.filters));
        }
    });

    const getFilterByIndex = (filters: unknown, index: number) => {
        return (filters as AdvancedFilter[])[index];
    };

    const createNewFilter = () => {
        return {
            field: props.fields[0].value,
            matchType: getMatchTypes(props.fields[0].value)[0].value as AdvancedFilterMatchType,
            value: undefined,
        };
    };

    const deleteFilter = (_: unknown, index: number) => {
        const filters = _ as AdvancedFilter[];
        if (filters.length > 1) {
            newFilters.value.splice(index, 1);
        } else {
            newFilters.value = [
                {
                    field: props.fields[0].value,
                    matchType: getMatchTypes(props.fields[0].value)[0].value as AdvancedFilterMatchType,
                    value: undefined,
                },
            ];
        }
    };
</script>
