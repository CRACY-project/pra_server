<template>
    <div class="flex flex-col gap-6 md:flex-row">
        <Step v-for="(step, i) in steps" :key="i" :step-number="i" :is-active="i <= currentStep">
            {{ step }}
        </Step>
    </div>
</template>
<script lang="ts" setup>
    interface IProps {
        steps: string[];
        currentStep: number;
    }

    defineProps<IProps>();
</script>
