<template>
    <div class="flex h-full w-full flex-col overflow-x-auto">
        <slot
            v-if="initialLoadDone && computedEntities.length < 1 && showGetStartedComponentIfEmpty && !isSearching"
            name="no-entities-found"
        >
            <NoEntitiesFound
                :subject="entityOptions.displayName"
                :allow-creation="showCreateButton"
                @create="createModal.open()"
            />
        </slot>
        <Table
            v-else-if="initialLoadDone"
            :headers="computedHeaders"
            :data="computedEntities"
            :search-options="searchOptions"
            :empty-message="emptyMessage"
            :backend-pagination-sorting="backendPaginationSorting"
            :class="takeMinimalSpace ? 'h-min' : ''"
            :open-with-single-click="openWithSingleClick"
            :navigate-with-single-click="navigateWithSingleClick"
            @open-item="(entity: any) => emit('open-entity', entity)"
            @update:applied-filters="onFilterUpdate"
            @sort-changed="onSortChanged"
        >
            <template #buttons>
                <div class="flex w-full flex-row justify-between">
                    <div class="mt-1">
                        <AdvancedFilter
                            v-if="showAdvancedFilter && advancedFilterFields && entityProvider"
                            :fields="advancedFilterFields"
                            @submit="getByFilters"
                        />
                    </div>
                    <div class="ml-2 flex items-center justify-end space-x-5">
                        <ReloadButton :is-reloaded="isReloaded" :is-reloading="isReloading" @reload="doReload" />
                        <slot name="download"></slot>
                        <slot name="header"></slot>
                        <slot name="create-button">
                            <Button
                                v-if="showCreateButton"
                                class="hidden whitespace-nowrap md:inline-flex"
                                @click="createModal.open()"
                            >
                                <PlusIcon class="mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
                                Create new
                            </Button>
                        </slot>
                    </div>
                </div>
            </template>
            <template v-for="(entity, i) of getCopyableSlots()" #[`data-${entity}`]="row" :key="i">
                <CopyableText :value="getCopyValue(entity, row.data)">
                    {{ format(entity, row) }}
                </CopyableText>
            </template>
            <template v-for="(_i, slot) of slots" #[slot]="row">
                <slot :name="slot" v-bind="row"></slot>
            </template>
            <template #data-actions="{ row }">
                <div class="space-x-6 text-right">
                    <slot name="actions" v-bind="{ row }"></slot>
                    <EditButton
                        v-if="showUpdateButton"
                        :class="{
                            invisible: shouldHideUpdateForEntity(row),
                        }"
                        :disabled="shouldDisableUpdateForEntity(row)"
                        @click="
                            if (!shouldDisableUpdateForEntity(row) && !shouldHideUpdateForEntity(row))
                                triggerUpdateModal(row);
                        "
                    />
                    <DeleteButton
                        v-if="showDeleteButton"
                        :class="{
                            invisible: shouldHideDeleteForEntity(row),
                        }"
                        :disabled="shouldDisableDeleteForEntity(row)"
                        @click="
                            if (!shouldDisableDeleteForEntity(row) && !shouldHideDeleteForEntity(row))
                                triggerDeleteModal(row);
                        "
                    />
                </div>
            </template>
        </Table>
        <Pagination
            v-if="pagination && computedEntities.length > 0"
            :take="currentPagination.take"
            :skip="currentPagination.skip"
            :size="currentPagination.totalItems"
            :filtered="currentPagination.filteredItems"
            @update:next="
                () => {
                    currentPagination.nextPage();
                    getEntitiesWithFiltersAndPagination();
                }
            "
            @update:previous="
                () => {
                    currentPagination.previousPage();
                    getEntitiesWithFiltersAndPagination();
                }
            "
        />
        <slot name="mobileButton">
            <CreateNewButtonSmall v-if="showCreateButton" @on-create-new="createModal.open()" />
        </slot>

        <Modal v-if="entityCreateAction?.submitHandler" :show="createModal.isOpen">
            <template #header> {{ crudActionToHrf(CrudActionType.create) }} {{ entityOptions.displayName }} </template>
            <CrudForm
                v-slot="{ formData }"
                :crud-action="CrudActionType.create"
                :entity-type="entityOptions.displayName"
                :entity-display-key="entityOptions.displayKey"
                :entity-submit-function="entityCreateAction?.submitHandler"
                :entity-fields="entityCreateAction.fields"
                :entity-exceptions="entityOptions.actions?.exceptions"
                @success="
                    e => {
                        getEntitiesWithFiltersAndPagination();
                        emit('entity-created', e);
                    }
                "
                @close="createModal.close()"
            >
                <slot name="createFields" :form-data="formData"></slot>
            </CrudForm>
        </Modal>
        <Modal v-if="entityUpdateAction?.submitHandler" :show="updateModal.isOpen">
            <template #header>
                {{ crudActionToHrf(CrudActionType.update) }} {{ entityOptions.displayName }}
                {{ entityOptions.showNameInUpdate ? `- ${currentSelectedEntity?.[entityOptions.displayKey]}` : '' }}
            </template>
            <CrudForm
                v-slot="{ formData, entity }"
                :crud-action="CrudActionType.update"
                :entity-type="entityOptions.displayName"
                :entity="currentSelectedEntity"
                :entity-display-key="entityOptions.displayKey"
                :entity-submit-function="entityUpdateAction?.submitHandler"
                :entity-to-form-mapper="props.entityOptions.entityToFormMapper"
                :entity-fields="
                    Array.isArray(entityUpdateAction?.fields)
                        ? entityUpdateAction?.fields
                        : entityUpdateAction?.fields?.(currentSelectedEntity)
                "
                :entity-exceptions="entityOptions.actions?.exceptions"
                @success="
                    e => {
                        getEntitiesWithFiltersAndPagination();
                        emit('entity-updated', e);
                    }
                "
                @close="updateModal.close()"
            >
                <slot name="updateFields" :form-data="formData" :entity="entity"></slot>
            </CrudForm>
        </Modal>
        <Modal v-if="entityCopyAction?.submitHandler" :show="copyModal.isOpen">
            <template #header>{{ crudActionToHrf(CrudActionType.copy) }} {{ entityOptions.displayName }}</template>
            <span class="mx-6 mt-6">
                Would you like to duplicate {{ currentSelectedEntity?.[entityOptions.displayKey] }} and all its related
                entities?
            </span>
            <CrudForm
                v-slot="{ formData, entity }"
                :crud-action="CrudActionType.copy"
                :entity-type="entityOptions.displayName"
                :entity="currentSelectedEntity"
                :entity-display-key="entityOptions.displayKey"
                :entity-submit-function="entityCopyAction?.submitHandler"
                :entity-to-form-mapper="props.entityOptions.entityToFormMapper"
                :entity-fields="
                    Array.isArray(entityCopyAction?.fields)
                        ? entityCopyAction?.fields
                        : entityCopyAction?.fields?.(currentSelectedEntity)
                "
                @success="
                    (e: any) => {
                        getEntitiesWithFiltersAndPagination();
                        emit('entity-copied', e);
                    }
                "
                @close="copyModal.close()"
            >
                <slot name="updateFields" :form-data="formData" :entity="entity"></slot>
            </CrudForm>
        </Modal>

        <RemoveModalCallback ref="removeModal" />
    </div>
</template>
<script setup lang="ts" generic="Entity">
    import { PlusIcon } from '@heroicons/vue/24/outline';
    import { Table } from '@jimber/shared-components';
    import { notify } from '@kyvg/vue3-notification';
    import { computed, type Ref, ref } from 'vue';
    import { onBeforeMount } from 'vue';

    import AdvancedFilter from '@/components/advanced-filter/AdvancedFilter.vue';
    import { crudActionToHrf } from '@/components/crud/crud.functions';
    import DeleteButton from '@/components/crud/DeleteButton.vue';
    import EditButton from '@/components/crud/EditButton.vue';
    import Button from '@/components/global/Button.vue';
    import CreateNewButtonSmall from '@/components/global/buttons/CreateNewButtonSmall.vue';
    import ReloadButton from '@/components/global/buttons/ReloadButton.vue';
    import CopyableText from '@/components/global/CopyableText.vue';
    import Modal from '@/components/global/Modal.vue';
    import RemoveModalCallback from '@/components/global/modals/RemoveModalCallback.vue';
    import NoEntitiesFound from '@/components/global/NoEntitiesFound.vue';
    import { useModal } from '@/composables/modal';
    import usePagination from '@/composables/pagination';
    import {
        type CreateFieldsSlot,
        CrudActionType,
        type CrudTableProps,
        type UpdateFieldsSlot,
    } from '@/types/crud-components';
    import type { IError } from '@/types/exceptions';

    import CrudForm from '../crud/CrudForm.vue';
    import Pagination from '../Pagination.vue';

    const emit = defineEmits<{
        'crud-modal-closed': [];
        'entity-created': [entity: Entity];
        'entity-updated': [entity: Entity];
        'entity-copied': [entity: Entity];
        'entity-deleted': [entity: Entity];
        'field-changed': [{ formData: any; field: string }];
        'select-changed': [data: any];
        reload: [];
        'open-entity': [entity: Entity];
        'search-filter-changed': [filters: { searchString?: string }];
        'advanced-filter-changed': [filters: any[]];
    }>();

    const props = withDefaults(defineProps<CrudTableProps<Entity>>(), {
        showReloadButton: false,
        showGetStartedComponentIfEmpty: true,
        backendPaginationSorting: false,
        takeMinimalSpace: true,
        showAdvancedFilter: true,
    });

    const slots = defineSlots<{
        createFields(_props: CreateFieldsSlot): any;
        updateFields(_props: UpdateFieldsSlot<Entity>): any;
        [key: `data-${string}`]: any; // slots passed to the Table
        [key: string]: any; // fow now otherwise too much refactoring
    }>();

    const currentPagination = usePagination(props.pagination?.itemsPerPage);

    const localEntities = ref<Entity[]>([]) as Ref<Entity[]>; // Type 'UnwrapRefSimple<T>' is not assignable to type 'T'
    const currentFilters = ref<{ searchString?: string }>({});
    const isSearching = ref<boolean>(false);
    const currentSort = ref<any>({});
    const initialLoadDone = ref<boolean>(false);
    const isReloading = ref<boolean>(false);
    const isReloaded = ref<boolean>(false);
    const advancedFilters = ref<any>({});

    const currentSelectedEntity = ref<any>();

    const showDeleteButton = computed(() => {
        return !!props.entityOptions.actions?.delete;
    });
    const showUpdateButton = computed(() => {
        return !!props.entityOptions.actions?.update;
    });
    const showCreateButton = computed(() => {
        if (props.entityOptions.actions?.create) return true;
        if (slots['createFields']) return true;
        return false;
    });

    const createModal = useModal();
    const updateModal = useModal();
    const copyModal = useModal();

    const computedEntities = computed(() => {
        if (props.entityProvider) {
            return localEntities.value;
        }

        return props.entities || [];
    });

    const computedHeaders = computed(() => {
        const h = [...props.headers];
        if (showDeleteButton.value || showUpdateButton) {
            h.push({
                key: 'actions',
                displayName: '',
            });
        }
        return h;
    });

    const entityCreateAction = computed(() => {
        return props.entityOptions.actions?.create;
    });
    const entityUpdateAction = computed(() => {
        return props.entityOptions.actions?.update;
    });
    const entityCopyAction = computed(() => {
        return props.entityOptions.actions?.copy;
    });
    const entityDeleteAction = computed(() => {
        return props.entityOptions.actions?.delete;
    });

    // modal stuff
    type RemoveModalCallbackType = typeof RemoveModalCallback extends new () => infer T ? T : never;
    const removeModal = ref<RemoveModalCallbackType>();

    const triggerDeleteModal = async (entity: any) => {
        if (!removeModal.value) return;
        if (!props.entityOptions.actions?.delete) return;

        const ok = await removeModal.value.showDialog({
            type: props.entityOptions.displayName,
            name: entity[props.entityOptions.displayKey],
            deletes: props.entityOptions.actions.delete.deletes,
        });
        emit('crud-modal-closed');
        if (ok) {
            try {
                const deleteHandler = entityDeleteAction.value?.submitHandler;
                if (!deleteHandler) {
                    console.error('No delete handler found');
                    return;
                }
                const deletedEntity = await deleteHandler(entity);

                if (!deletedEntity) return;

                notify({
                    text: `${props.entityOptions.displayName} ${
                        deletedEntity[props.entityOptions.displayKey]
                    } successfully deleted`,
                    type: 'success',
                });
                getEntitiesWithFiltersAndPagination();
                emit('entity-deleted', deletedEntity);
            } catch (error) {
                const message = (error as IError).message;
                notify({
                    text: message ? message.toString() : `If this issue persists, please contact your administrator.`,
                    type: 'error',
                });
            }
        }
    };

    const triggerUpdateModal = async (entity: any) => {
        currentSelectedEntity.value = entity;
        const entityOptions = props.entityOptions;
        const actions = entityOptions.actions;
        if (!actions || !actions.update) return;

        if (actions.read) {
            try {
                const readEntity = await actions.read(entity);
                if (readEntity) {
                    currentSelectedEntity.value = readEntity;
                } else throw new Error('No entity returned from read function');
            } catch {
                notify({
                    type: 'error',
                    text: `Couldn't get info for ${entityOptions.displayName} ${entity[entityOptions.displayKey]}`,
                });
                return;
            }
        }

        updateModal.open();
    };

    const doReload = async () => {
        isReloading.value = true;
        await getEntitiesWithFiltersAndPagination();
        emit('reload');
        isReloading.value = false;
        showReloadedText();
    };

    const showReloadedText = () => {
        isReloaded.value = true;
        setTimeout(() => {
            isReloaded.value = false;
        }, 2000);
    };

    const shouldDisableUpdateForEntity = (entity: any) => {
        if (!props.entityOptions.actions?.update?.disableAction) return false;
        return props.entityOptions.actions.update.disableAction(entity);
    };

    const shouldDisableDeleteForEntity = (entity: any) => {
        if (props.entityOptions.actions?.delete?.disableAction) {
            return props.entityOptions.actions.delete.disableAction(entity);
        }
        return false;
    };

    const shouldHideUpdateForEntity = (entity: any) => {
        if (!props.entityOptions.actions?.update?.hideAction) return false;
        return props.entityOptions.actions.update.hideAction(entity);
    };

    const shouldHideDeleteForEntity = (entity: any) => {
        if (props.entityOptions.actions?.delete?.hideAction) {
            return props.entityOptions.actions.delete.hideAction(entity);
        }
        return false;
    };

    const onFilterUpdate = async (e: any) => {
        isSearching.value = true;
        currentFilters.value = e;

        emit('search-filter-changed', currentFilters.value);

        currentPagination.reset();
        getEntitiesWithFiltersAndPagination();
    };

    const onSortChanged = async (e: any) => {
        currentSort.value = e;
        currentPagination.reset();
        getEntitiesWithFiltersAndPagination();
    };

    const getEntitiesWithFiltersAndPagination = async () => {
        if (!props.entityProvider) return;

        const orderBy: any = {};
        if (currentSort.value.prop && currentSort.value.order) {
            orderBy[currentSort.value.prop] = currentSort.value.order.toLowerCase();
        }

        try {
            const response = await props.entityProvider.getEntities({
                pagination: { skip: currentPagination.skip, take: currentPagination.take },
                filters: currentFilters.value,
                orderBy,
                advancedFilters: advancedFilters.value,
            });
            currentPagination.filteredItems = response.data.length;
            currentPagination.totalItems = response.size;

            localEntities.value = response.data;
        } catch {
            notify({
                type: 'error',
                text: `Couldn't fetch ${props.entityOptions.displayName}`,
            });
        }
    };

    onBeforeMount(async () => {
        if (props.entityProvider) {
            await getEntitiesWithFiltersAndPagination();
        }
        initialLoadDone.value = true;
    });

    defineExpose({ doReload });

    const getByFilters = async (filtersInput: any) => {
        isSearching.value = true;
        if (Object.keys(filtersInput).length > 0) currentPagination.skip = 0;
        advancedFilters.value = filtersInput;

        emit('advanced-filter-changed', filtersInput);
        getEntitiesWithFiltersAndPagination();
    };

    const columnIsCopyable = (slotName: string) => {
        const fieldName = slotName.split('data-').at(-1);
        const column = computedHeaders.value.find(header => header.key === fieldName);

        return column?.copyable;
    };

    const getCopyValue = (slotName: string, row: any) => {
        const copyValue = { subject: '', text: '' };
        const fieldName = slotName.split('data-').at(-1);

        if (!fieldName) return copyValue;

        const columnKey = computedHeaders.value.find(header => header.key === fieldName);

        if (!columnKey?.displayName) return copyValue;

        copyValue.subject = columnKey.displayName;
        copyValue.text = row;

        return copyValue;
    };

    const getCopyableSlots = () => {
        const copyableEntities: string[] = [];
        const existingSlots: string[] = Object.keys(slots);

        for (const entity of computedHeaders.value) {
            if (columnIsCopyable(entity.key) && !existingSlots.includes(`data-${entity.key}`)) {
                copyableEntities.push(entity.key);
            }
        }

        return copyableEntities;
    };

    const format = (slotName: string, data: any) => {
        const fieldName = slotName.split('data-').at(-1);

        const columnKey = computedHeaders.value.find(header => header.key === fieldName);

        if (!columnKey?.formatter) return data.data;

        return columnKey.formatter(data.row);
    };
</script>

<style>
    .rotating {
        transition: transform 0.3s ease-in-out;
    }

    .rotating:hover {
        transform: rotateZ(90deg);
    }
</style>
