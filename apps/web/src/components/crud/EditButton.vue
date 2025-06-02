<template>
    <CrudButton class="text-amber-500 hover:text-amber-600" title="Edit">
        <PencilIcon class="h-6 w-6" aria-hidden="true" />
    </CrudButton>
</template>
<script setup lang="ts">
    import { PencilIcon } from '@heroicons/vue/24/solid';

    import CrudButton from '@/components/crud/CrudButton.vue';
</script>
