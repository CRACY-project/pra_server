<template>
    <IconButton class="pb-0 pt-0" @click.stop @dblclick.stop @click.prevent>
        <slot> </slot>
    </IconButton>
</template>
<script setup lang="ts">
    import IconButton from '@/components/global/IconButton.vue';
</script>
