<template>
    <div v-show="props.title === selectedTitle" class="overflow-y-auto">
        <slot />
    </div>
</template>

<script setup lang="ts">
    import { inject } from 'vue';

    interface IProps {
        title: string;
    }

    const props = defineProps<IProps>();
    const selectedTitle = inject('selectedTitle');
</script>
