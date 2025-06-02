<template>
    <slot>For more information: </slot>
    <a class="underline" :href="documentationPaths[page]" target="_blank">{{ documentationPaths[page] }}</a>
</template>
<script lang="ts" setup>
    import { documentationPaths } from './DocumentationLink';
    interface IProps {
        page: keyof typeof documentationPaths;
    }

    defineProps<IProps>();
</script>
