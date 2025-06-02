<template>
    <Alert :show-alert="show" type="warning" @close="$emit('update:show', false)">
        <template #title><slot name="title">Invalid Action</slot></template>
        <template #content>
            <div>
                <slot name="message"></slot>
            </div>
        </template>
        <template #actions>
            <CancelButton @click="$emit('update:show', false)" />
        </template>
    </Alert>
</template>

<script lang="ts" setup>
    defineEmits(['update:show']);

    interface IProps {
        show: boolean;
    }

    withDefaults(defineProps<IProps>(), {
        show: false,
    });
</script>

<style scoped></style>
