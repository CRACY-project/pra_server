<template>
    <div class="flex flex-col">
        <span class="truncate text-sm font-medium uppercase tracking-[.15em] text-gray-600 dark:text-gray-300"
            ><slot name="title"></slot
        ></span>
        <span class="truncate text-base font-bold text-gray-900 dark:text-gray-300"><slot name="amount"></slot></span>
    </div>
</template>
