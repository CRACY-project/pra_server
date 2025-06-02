<template>
    <div class="relative flex h-screen bg-white dark:bg-dark-800">
        <CompanyLayoutSideBar :key="companyName" :company-name="companyName" />
        <router-view :key="companyName" :company-name="companyName" />
    </div>
</template>

<script lang="ts" setup>
    import CompanyLayoutSideBar from './CompanyLayoutSidebar.vue';

    defineProps<{ companyName: string }>();
</script>

<style scoped></style>
