<template>
    <div>
        <span class="block h-2 w-2 rounded-full bg-red-400" :class="{ '!bg-green-400': isActive(pde) }"></span>
    </div>
</template>
<script lang="ts" setup>
    import type { PDEDto } from '@cracy/typescript-client';
    defineProps<{ pde: PDEDto }>();
    function isActive(pde: PDEDto): boolean {
        const timeoutDate = new Date();
        timeoutDate.setSeconds(timeoutDate.getSeconds() - 120);
        return new Date(pde.lastSeen) > timeoutDate;
    }
</script>
