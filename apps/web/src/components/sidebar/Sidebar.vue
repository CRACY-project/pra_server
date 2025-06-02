<template>
    <component
        :is="isMobile ? SidebarMobileWrapper : securityPanel ? SidebarContent : SidebarMultiContent"
        :security-panel="securityPanel"
        :company="company"
    ></component>
</template>

<script setup lang="ts">
    import { type CompanyDto } from '@cracy/typescript-client';
    import { computed, ref } from 'vue';

    import SidebarContent from './SidebarContent.vue';
    import SidebarMobileWrapper from './SidebarMobileWrapper.vue';
    import SidebarMultiContent from './SidebarMultiContent.vue';

    const windowWidth = ref(window.innerWidth);
    const isMobile = computed(() => windowWidth.value < 768);
    defineProps<{ company: CompanyDto; securityPanel?: boolean }>();

    window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth;
    });
</script>
