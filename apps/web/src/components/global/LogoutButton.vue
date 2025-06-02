<template>
    <button
        :class="`flex w-full items-center px-4 py-2 hover:cursor-pointer hover:bg-slate-100 ${classes}`"
        @click="logout()"
    >
        <ArrowLeftStartOnRectangleIcon aria-hidden="true" class="mr-2 h-5 w-5 text-slate-400" />
        Sign out
    </button>
</template>

<script lang="ts" setup>
    import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/24/outline';
    import { useRouter } from 'vue-router';

    interface IProps {
        classes: string;
    }

    const router = useRouter();

    const logout = () => {
        router.push({ name: 'logout' });
    };

    const { classes } = defineProps<IProps>();
</script>
