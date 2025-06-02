<template>
    <div class="h-min rounded-md border bg-white shadow-sm dark:bg-dark-400">
        <h3 class="flex items-center border-b px-5 py-4 text-lg font-medium leading-6 text-gray-900 dark:text-gray-300">
            <slot name="header-text"></slot>
        </h3>

        <div class="relative flex flex-col justify-between pb-4 pt-3 text-sm dark:text-gray-300">
            <slot name="body"></slot>
        </div>
    </div>
</template>
<script setup lang="ts"></script>
<style scope></style>
