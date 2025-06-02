<template>
    <Modal :show="open" @close="closeModal">
        <template #header>PDE Information</template>
        <template #content>
            <div class="overflow-y-auto px-4 pb-4 pt-2 dark:text-gray-300 sm:px-6">
                <PDEInfoContent :companyName="companyName" :pdeId="pdeId" />
            </div>
        </template>
        <template #actions>
            <Button :disabled="isLoading || (!pdeInfo?.systemInfo && !pdeInfo?.libraryInfo)" @click="downloadPDEInfo()">
                Download
            </Button>
            <CancelButton class="mr-2" @click="closeModal">Close</CancelButton>
        </template>
    </Modal>
</template>

<script setup lang="ts">
    import Modal from '@/components/global/Modal.vue';
    import PDEInfoContent from './PDEInfoContent.vue';
    import Button from '@/components/global/Button.vue';
    import { onBeforeMount, ref } from 'vue';
    import CancelButton from '@/components/global/buttons/CancelButton.vue';
    import { usePDEService } from '@/services/pde.service';
    import type { GetPDEInfoResponse } from '@cracy/typescript-client';

    interface IProps {
        open: boolean;
        companyName: string;
        pdeId: number;
    }

    const props = defineProps<IProps>();

    const emit = defineEmits(['close']);

    const pdeInfo = ref<GetPDEInfoResponse>();
    const isLoading = ref<boolean>(false);

    const closeModal = () => {
        emit('close');
    };

    const fetchPDEInfo = async () => {
        const { getPDEInfo } = usePDEService();

        isLoading.value = true;

        pdeInfo.value = await getPDEInfo({ companyName: props.companyName, id: props.pdeId });

        isLoading.value = false;
    };

    const downloadPDEInfo = async () => {
        if (!pdeInfo.value) {
            return;
        }

        const { getPDE } = usePDEService();

        isLoading.value = true;

        const pde = await getPDE({ companyName: props.companyName, id: props.pdeId });
        const pdeInfoFile: any = {};

        if (pdeInfo.value?.systemInfo.data) {
            pdeInfoFile.systemInfo = JSON.parse(pdeInfo.value?.systemInfo.data as any);
            pdeInfoFile.systemInfo.timestamp = pdeInfo.value?.systemInfo.timestamp;
        }

        if (pdeInfo.value?.libraryInfo.data) {
            pdeInfoFile.libraryInfo = {};
            pdeInfoFile.libraryInfo.libraries = JSON.parse(pdeInfo.value?.libraryInfo.data as any);
            pdeInfoFile.libraryInfo.timestamp = pdeInfo.value?.libraryInfo.timestamp;
        }

        const blob = new Blob([JSON.stringify(pdeInfoFile, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${props.companyName}-${pde.name}-pde-info.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        isLoading.value = false;
        closeModal();
    };

    onBeforeMount(() => {
        fetchPDEInfo();
    });
</script>
