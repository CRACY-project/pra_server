<template>
    <div class="flex w-full space-x-5 md:w-max">
        <div class="w-full">
            <label v-if="withLabel" for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search
            </label>
            <div class="relative mt-1 rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                    <MagnifyingGlassIcon class="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    id="search"
                    v-model="searchString"
                    type="text"
                    name="search"
                    class="block w-full rounded-md pl-9 dark:bg-dark-600 dark:text-gray-300 dark:placeholder:text-gray-500 sm:text-sm"
                    placeholder="Search"
                    @keydown.esc="searchString = ''"
                    @keyup="filter"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3" aria-hidden="true" @click="clearSearch">
                    <XMarkIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid';
    import { ref } from 'vue';

    interface IProps {
        data: any[];
        withLabel?: boolean;
    }

    const emit = defineEmits(['update:searchValue', 'update:searchClear']);

    const props = withDefaults(defineProps<IProps>(), {
        withLabel: true,
    });
    const searchString = ref<string>('');

    const filter = () => {
        if (searchString.value === '') {
            return emit('update:searchClear');
        }
        const result = updateSearch();

        return emit('update:searchValue', result);
    };

    const updateSearch = () => {
        const values = Object.values(props.data);

        if (searchString.value === '') {
            return values;
        }

        return values.filter((item: any) => {
            return Object.values(item).some((value: any) => {
                if (value && typeof value === 'object') {
                    return Object.values(value).some((objectValue: any) => {
                        return String(objectValue).toLowerCase().includes(searchString.value.toLowerCase());
                    });
                } else {
                    return value ? String(value).toLowerCase().includes(searchString.value.toLowerCase()) : value;
                }
            });
        });
    };

    const clearSearch = () => {
        searchString.value = '';
        return emit('update:searchClear');
    };

    defineExpose({
        filter,
    });
</script>
