<template>
    <Button @click="openModal">Tags</Button>
    <Modal :show="open" @close="open = false">
        <template #header>Tags</template>

        <template #content>
            <div class="md:max-h-[70vh]">
                <div
                    v-for="(tag, i) in tags"
                    :key="i"
                    class="flex justify-between border-b px-4 py-4 last:border-b-0 sm:px-6"
                >
                    <Chip>{{ tag.name }}</Chip>
                    <div><DeleteButton @click="deleteTagHandler(tag.id)" /></div>
                </div>
            </div>
        </template>

        <template #actions>
            <CancelButton class="mr-2" @click="open = false">Close</CancelButton>
        </template>
    </Modal>
</template>

<script lang="ts" setup>
    import type { TagDto } from '@cracy/typescript-client';
    import { ref } from 'vue';

    import Button from '@/components/global/Button.vue';
    import Chip from '@/components/global/Chip.vue';
    import Modal from '@/components/global/Modal.vue';
    import { useTagService } from '@/services/tag.service';

    const tags = ref<TagDto[]>([]);
    const open = ref<boolean>(false);

    interface IProps {
        companyName: string;
    }

    const props = defineProps<IProps>();

    const emit = defineEmits<{
        delete: [];
    }>();

    const fetchTags = async () => {
        const { getTags } = useTagService();
        const tagsData = await getTags({ companyName: props.companyName });
        tags.value = tagsData.tags;
    };

    const deleteTagHandler = async (tagId: number) => {
        const { deleteTag } = useTagService();

        await deleteTag({ companyName: props.companyName, id: tagId });
        await fetchTags();

        emit('delete');
    };

    const openModal = async () => {
        await fetchTags();
        open.value = true;
    };
</script>

<style></style>
