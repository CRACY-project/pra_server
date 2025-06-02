<template>
    <Alert :show-alert="show" type="caution" @close="cancel">
        <template #title>You have unsaved changes</template>
        <template #content> Your unsubmitted changes will be lost. Are you sure you want to continue? </template>
        <template #actions>
            <WarningButton @click="browse"> Quit without submitting </WarningButton>
            <CancelButton @click="cancel" />
        </template>
    </Alert>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import { onBeforeRouteLeave, useRouter } from 'vue-router';

    import Alert from '@/components/global/Alert.vue';

    defineEmits(['update:show']);

    const show = ref(false);
    const browseToRoute = ref();
    const router = useRouter();

    onBeforeRouteLeave(to => {
        if (browseToRoute.value) {
            return true;
        }

        browseToRoute.value = to.path;
        show.value = true;
        return false;
    });

    const browse = () => {
        if (browseToRoute.value) {
            router.push(browseToRoute.value);
        }
        show.value = false;
    };

    const cancel = () => {
        browseToRoute.value = null;
        show.value = false;
    };
</script>

<style scoped></style>
