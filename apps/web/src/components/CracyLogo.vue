<template>
    <img :src="isDark ? Dark : Light" alt="logo" class="mr-4 h-[24px] w-[auto] md:hidden" />
    <img :src="isDark ? DarkLong : LightLong" alt="logo" class="mr-4 hidden h-12 w-[auto] md:block" />
</template>
<script lang="ts" setup>
    import { useDark } from '@vueuse/core';

    import LightLong from '@/assets/final-cracy-no-bg.png';
    import DarkLong from '@/assets/final-cracy-no-bg.png';
    import Dark from '@/assets/final-cracy-no-bg.png';
    import Light from '@/assets/final-cracy-no-bg.png';
    const isDark = useDark();
</script>
