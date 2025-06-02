<template>
    <Alert v-if="show" :show-alert="show" @close="cancel">
        <template #title>Deleting {{ type }}</template>
        <template #content>
            Are you sure you want to delete {{ name }}?
            <div v-if="deletes?.length > 0">
                This will also delete:
                <ul class="mx-auto w-3/4">
                    <li v-for="(del, idx) of deletes" :key="idx" class="list-disc">
                        {{ del }}
                    </li>
                </ul>
            </div>
            <ul v-if="serverErrors && serverErrors.length > 0" class="mt-2 pr-6 text-sm text-red-500">
                <li v-for="(error, idx) in serverErrors" :key="idx">{{ error }}</li>
            </ul>
        </template>
        <template #actions>
            <Button bg-color="bg-red-500" text-color="text-white" bg-color-hover="hover:bg-red-600" @click="deleteItem"
                >Delete {{ type }}
            </Button>
            <CancelButton @click="cancel" />
        </template>
    </Alert>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    import Alert from '@/components/global/Alert.vue';
    import Button from '@/components/global/Button.vue';
    import CancelButton from '@/components/global/buttons/CancelButton.vue';

    const show = ref(false);

    const type = ref('');
    const name = ref<string>();
    const deletes = ref<string[]>([]);
    const serverErrors = ref([]);

    const resolvePromise = ref<(_value: boolean) => void>();
    const rejectPromise = ref<(_value: boolean) => void>();

    const showDialog = (opts: { type: string; name: string; deletes?: string[] }) => {
        show.value = true;
        type.value = opts.type;
        name.value = opts.name;
        deletes.value = opts.deletes || [];
        return new Promise((resolve, reject) => {
            resolvePromise.value = resolve;
            rejectPromise.value = reject;
        });
    };

    const deleteItem = () => {
        if (resolvePromise.value) resolvePromise.value(true);
        show.value = false;
    };

    const cancel = () => {
        if (resolvePromise.value) resolvePromise.value(false);
        show.value = false;
    };

    defineExpose({ showDialog });
</script>

<style scoped></style>
