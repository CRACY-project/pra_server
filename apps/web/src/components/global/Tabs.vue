<template>
    <div>
        <div class="lg:hidden">
            <div class="border-b">
                <nav class="-mb-px flex" aria-label="Tabs">
                    <a
                        v-for="tab in tabs"
                        :key="tab.name"
                        :href="tab.href"
                        :class="[
                            tab.current
                                ? 'border-primary-500 text-primary-600'
                                : 'hover: border-transparent text-gray-500 hover:text-gray-700',
                            'w-1/4 border-b-2 px-1 py-4 text-center text-sm font-medium',
                            tabs.length > 1 ? 'border-b-2' : 'border-b-0',
                        ]"
                        :aria-current="tab.current ? 'page' : undefined"
                    >
                        {{ tab.name }}
                    </a>
                </nav>
            </div>
        </div>
        <div class="hidden lg:block">
            <nav class="flex space-x-4" aria-label="Tabs">
                <a
                    v-for="tab in tabs"
                    :key="tab.name"
                    :href="tab.href"
                    :class="[
                        tab.current ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700',
                        'rounded-md px-3 py-2 text-sm font-medium',
                    ]"
                    :aria-current="tab.current ? 'page' : undefined"
                >
                    {{ tab.name }}
                </a>
            </nav>
        </div>
    </div>
</template>

<script lang="ts" setup>
    interface IProps {
        tabs: any[];
    }

    defineProps<IProps>();
</script>

<style scoped></style>
