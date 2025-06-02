<template>
    <div class="my-3 h-64 rounded-xl border-2 p-1">
        <img alt="QR code" class="h-full" :src="qrCode" />
    </div>
</template>
<script lang="ts" setup>
    interface IProps {
        qrCode: string;
    }

    defineProps<IProps>();
</script>
