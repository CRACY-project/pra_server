<template>
    <Alert :show-alert="show" type="caution" @close="$emit('update:show', false)">
        <template #title>Submit changes?</template>
        <template #content> Your unsubmitted changes will be lost. Submit changes before closing? </template>
        <template #actions>
            <slot name="save"></slot>
        </template>
    </Alert>
</template>

<script lang="ts" setup>
    import Alert from '@/components/global/Alert.vue';
    defineEmits(['update:show']);

    interface IProps {
        show: boolean;
    }
    const { show = false } = defineProps<IProps>();
</script>

<style scoped></style>
