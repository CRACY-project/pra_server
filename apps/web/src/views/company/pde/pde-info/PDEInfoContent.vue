<template>
    <div class="flex flex-col gap-2">
        <div v-if="pdeInfo?.systemInfo">
            <div class="flex flex-row items-center gap-1">
                <p
                    class="mb-1 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                    @click="openSystemInfo = !openSystemInfo"
                >
                    System Information
                </p>
                <component
                    :is="openSystemInfo ? ChevronDownIcon : ChevronRightIcon"
                    class="h-6 w-6 cursor-pointer"
                    aria-hidden="true"
                    @click="openSystemInfo = !openSystemInfo"
                />
            </div>
            <div
                v-if="openSystemInfo"
                class="flex flex-col overflow-y-auto rounded border border-gray-300 p-2 dark:border-dark-200 md:max-h-[30vh]"
            >
                <PDEInfo
                    v-for="[key, value] in Object.entries(JSON.parse(pdeInfo.systemInfo.data as any))"
                    :key="key"
                    :name="key"
                    :value="value"
                />
            </div>
        </div>
        <div v-if="pdeInfo?.libraryInfo">
            <div class="flex flex-row items-center gap-1">
                <p
                    class="mb-1 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300"
                    @click="openLibraryInfo = !openLibraryInfo"
                >
                    Library Information
                </p>
                <component
                    :is="openLibraryInfo ? ChevronDownIcon : ChevronRightIcon"
                    class="h-6 w-6 cursor-pointer"
                    aria-hidden="true"
                    @click="openLibraryInfo = !openLibraryInfo"
                />
            </div>
            <div
                v-if="openLibraryInfo"
                class="flex flex-col rounded border border-gray-300 p-2 dark:border-dark-200 md:max-h-[30vh] md:overflow-y-auto"
            >
                <PDEInfo
                    v-for="[key, value] in Object.entries(JSON.parse(pdeInfo.libraryInfo.data as any))"
                    :key="key"
                    :name="key"
                    :value="value"
                />
            </div>
        </div>
        <div v-if="!pdeInfo?.systemInfo && !pdeInfo?.libraryInfo">No PDE information available</div>
    </div>
</template>

<script lang="ts" setup>
    import { onBeforeMount, ref } from 'vue';
    import PDEInfo from './PDEInfo.vue';
    import type { GetPDEInfoResponse } from '@cracy/typescript-client';
    import { usePDEService } from '@/services/pde.service';
    import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

    interface IProps {
        companyName: string;
        pdeId: number;
    }

    const props = defineProps<IProps>();

    const pdeInfo = ref<GetPDEInfoResponse>();
    const openSystemInfo = ref<boolean>(false);
    const openLibraryInfo = ref<boolean>(false);

    onBeforeMount(async () => {
        const { getPDEInfo } = usePDEService();

        pdeInfo.value = await getPDEInfo({ companyName: props.companyName, id: props.pdeId });
    });
</script>

<style></style>
