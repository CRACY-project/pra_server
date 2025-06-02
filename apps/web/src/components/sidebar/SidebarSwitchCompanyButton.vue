<template>
    <IconButton
        class="mr-2 border-none hover:cursor-pointer"
        bg-color="transparent"
        bg-color-hover="transparent"
        shadow="none"
        @click="$router.push('/')"
    >
        <img class="fill=purple-500 h-7 w-7" :src="IReturnHome" alt="" />
    </IconButton>
</template>
<script setup lang="ts">
    import { useDark } from '@vueuse/core';

    import returnHome from '@/assets/return-home.svg';
    import returnHomeDark from '@/assets/return-home-dark.svg';
    const isDark = useDark();

    let IReturnHome: string;

    if (isDark) {
        IReturnHome = returnHomeDark;
    } else {
        IReturnHome = returnHome;
    }
</script>
