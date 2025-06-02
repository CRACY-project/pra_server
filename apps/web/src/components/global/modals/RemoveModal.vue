<template>
    <Alert :show-alert="props.show" @close="$emit('update:show', false)">
        <template #title>Deleting {{ props.type }}</template>
        <template #content>
            <slot name="message">
                <p class="truncate">Are you sure you want to delete {{ props.selected?.name }}?</p>
            </slot>
            <div v-if="props.selected?.deletes?.length > 0">
                This will also delete:
                <ul class="mx-auto w-3/4">
                    <li v-for="(del, idx) of props.selected.deletes" :key="idx" class="list-disc">
                        {{ del }}
                    </li>
                </ul>
            </div>
            <ul v-if="props.serverErrors && props.serverErrors.length > 0" class="mt-2 pr-6 text-sm text-red-500">
                <li v-for="(error, idx) in props.serverErrors" :key="idx">{{ error }}</li>
            </ul>
        </template>
        <template #actions>
            <Button
                bg-color="bg-red-500"
                text-color="text-gray-100"
                bg-color-hover="hover:bg-red-600"
                @click.prevent="$emit('submitDelete', props.selected.id)"
                >Delete {{ type }}
            </Button>

            <Button
                bg-color="bg-white dark:bg-dark-200"
                text-color="text-gray-900 dark:text-gray-300"
                border="border"
                bg-color-hover="hover:bg-gray-50 dark:hover:bg-dark-100"
                class="h-min md:mr-2"
                @click.prevent="remove()"
            >
                Cancel
            </Button>
        </template>
    </Alert>
</template>

<script lang="ts" setup>
    import Alert from '@/components/global/Alert.vue';
    import Button from '@/components/global/Button.vue';
    const emit = defineEmits(['update:show', 'submitDelete', 'update:show', 'clear-errors']);

    interface IProps {
        show: boolean;
        type: string;
        selected: any;
        serverErrors?: string[];
    }
    const props = withDefaults(defineProps<IProps>(), {
        show: false,
        serverErrors: undefined,
    });
    function remove() {
        emit('clear-errors');
        emit('update:show', false);
    }
</script>

<style scoped></style>
