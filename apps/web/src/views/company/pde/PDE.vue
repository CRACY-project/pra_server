<template>
    <CompanyLayout>
        <template #sectionTitle>Company</template>
        <template #pageTitle> Products with Digital Entities </template>
        <template #content>
            <CrudTable
                open-with-single-click
                :entity-provider="pdeProvider"
                :headers="headers"
                :entity-options="entityOptions"
                :empty-message="`No PDE found`"
                :search-options="searchOptions"
                :backend-pagination-sorting="true"
                :pagination="{ itemsPerPage: 400 }"
                @open-entity="openPDEInfo"
            >
                <template #data-name="{ row }">
                    <div class="flex items-center gap-1">
                        <StatusIcon class="flex w-5 justify-center" :pde="row" />
                        {{ row.name }}
                    </div>
                </template>
                <template #data-securityScore="{ row }"> <SecurityScoreValue :score="row.score" /> </template>
                <template #createFields="{ formData }">
                    <PDEFields :form="formData" />
                </template>
                <template #updateFields="{ formData }">
                    <PDEFields :form="formData" />
                </template>

                <template #actions>
                    <IconButton @click.stop="() => console.log('coming soon')" title="Download SBOM">
                        <ArchiveBoxArrowDownIcon class="h-6 w-6 text-green-500" />
                    </IconButton>
                </template>
            </CrudTable>

            <PDEInfoModal
                v-if="pdeInfoModal.isOpen && selectedPDE"
                :open="pdeInfoModal.isOpen"
                @close="pdeInfoModal.close()"
                :company-name="companyName"
                :pde-id="selectedPDE.id"
            />
        </template>
    </CompanyLayout>
</template>

<script lang="ts" setup>
    import { type PDEDto } from '@cracy/typescript-client';
    import { ArchiveBoxArrowDownIcon } from '@heroicons/vue/24/solid';
    import { ref } from 'vue';

    import CrudTable from '@/components/crud/CrudTable.vue';
    import IconButton from '@/components/global/IconButton.vue';
    import StatusIcon from '@/components/StatusIcon.vue';
    import CompanyLayout from '@/layouts/CompanyLayout/CompanyLayout.vue';
    import { usePDEService } from '@/services/pde.service';
    import { type IEntityOptions, type IEntityProvider, type SearchOptions } from '@/types/crud-components';
    import { headers, type PDEFormData } from '@/views/company/pde/pde.types';
    import PDEFields from '@/views/company/pde/PDEFields.vue';
    import SecurityScoreValue from '@/views/company/pde/SecurityScoreValue.vue';
    import PDEInfoModal from './pde-info/PDEInfoModal.vue';
    import { useModal } from '@/composables/modal';

    const props = defineProps<{
        companyName: string;
    }>();

    const searchOptions = ref<SearchOptions>({
        enableSearch: true,
        options: ['all'],
    });

    const { deletePDE, getPDEs, updatePDE, createPDE } = usePDEService();
    const pdeInfoModal = useModal();

    const selectedPDE = ref<PDEDto | null>(null);

    const entityOptions: IEntityOptions<PDEDto, PDEFormData> = {
        displayName: 'PDE',
        displayKey: 'name',
        actions: {
            exceptions: {
                conflict: {
                    serial_number: 'PDE with this serial number already exists',
                    name: 'PDE with this name already exists',
                },
            },
            create: {
                submitHandler: data => {
                    return createPDE({
                        companyName: props.companyName,
                        createPDEDto: {
                            name: data.name,
                            token: data.token,
                            serialNumber: data.serialNumber,
                        },
                    });
                },
            },
            update: {
                submitHandler: (formdata, oldPde) => {
                    return updatePDE({
                        companyName: props.companyName,
                        id: oldPde.id,
                        updatePDEDto: {
                            name: formdata.name,
                            serialNumber: formdata.serialNumber,
                        },
                    });
                },
            },
            delete: {
                submitHandler: pde => deletePDE({ companyName: props.companyName, id: pde.id }),
            },
        },
    };

    const pdeProvider: IEntityProvider<PDEDto> = {
        getEntities: async ({ pagination, filters, orderBy, advancedFilters }) => {
            return await getPDEs({
                companyName: props.companyName,
                orderBy,
                search: filters?.searchString,
            });
        },
    };

    const openPDEInfo = (pde: PDEDto) => {
        selectedPDE.value = pde;
        pdeInfoModal.open();
    };
</script>

<style scoped></style>
