<template>
    <div
        class="rounded font-bold"
        :class="[
            score >= 80
                ? 'text-green-500'
                : score >= 40
                  ? 'text-orange-500'
                  : score >= 10
                    ? 'text-red-500'
                    : 'text-red-800',
        ]"
    >
        {{ score }}%
    </div>
</template>

<script setup lang="ts">
    withDefaults(defineProps<{ score: number }>(), { score: 0 });
</script>
