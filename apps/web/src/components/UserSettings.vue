<template>
    <div class="flex flex-col gap-3">
        <SettingsTab>
            <template #header-text>Appearance</template>
            <template #body>
                <SwitchGroup as="div" class="flex w-full items-center justify-between p-5">
                    <span class="flex flex-grow flex-col">
                        <SwitchLabel as="span" class="text-sm font-medium text-gray-900 dark:text-gray-300" passive>
                            Dark mode
                        </SwitchLabel>
                        <SwitchDescription as="span" class="text-sm text-gray-500 dark:text-gray-100"
                            >You can choose between 2 options. Light mode and dark mode.</SwitchDescription
                        >
                    </span>
                    <Toggle :key="isDark + ''" :enabled="isDark" @clicked="isDark = !isDark"></Toggle>
                </SwitchGroup>
            </template>
        </SettingsTab>
    </div>
</template>
<script setup lang="ts">
    import { SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue';
    import { useDark } from '@vueuse/core';

    import Toggle from '@/components/global/Toggle.vue';
    import SettingsTab from '@/components/settings/SettingsTab.vue';

    const isDark = useDark();
</script>
