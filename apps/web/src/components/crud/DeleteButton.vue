<template>
    <CrudButton class="text-red-500 hover:text-red-600" title="Delete">
        <TrashIcon class="h-6 w-6" aria-hidden="true" />
    </CrudButton>
</template>
<script setup lang="ts">
    import { TrashIcon } from '@heroicons/vue/24/solid';

    import CrudButton from '@/components/crud/CrudButton.vue';
</script>
