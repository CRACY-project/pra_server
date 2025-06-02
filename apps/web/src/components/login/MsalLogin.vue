<template>
    <Button
        :class="{
            'dark:bg-dark-600 dark:text-gray-300 dark:hover:bg-dark-700': props.darkModeSupport,
        }"
        bg-color="bg-white"
        text-color="text-gray-900"
        :border="`border border-gray-300 ${props.darkModeSupport ? 'dark:border-dark-200' : 'dark:border-gray-300'}`"
        bg-color-hover="hover:bg-gray-50"
        class="justify-center"
        @click="loginPopup"
    >
        <svg
            class="mr-2 h-5 w-5"
            enable-background="new 0 0 2499.6 2500"
            viewBox="0 0 2499.6 2500"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="m1187.9 1187.9h-1187.9v-1187.9h1187.9z" fill="#f1511b" />
            <path d="m2499.6 1187.9h-1188v-1187.9h1187.9v1187.9z" fill="#80cc28" />
            <path d="m1187.9 2500h-1187.9v-1187.9h1187.9z" fill="#00adef" />
            <path d="m2499.6 2500h-1188v-1187.9h1187.9v1187.9z" fill="#fbbc09" />
        </svg>
        Sign in with Microsoft
    </Button>
</template>

<script setup lang="ts">
    import { BrowserAuthError } from '@azure/msal-browser';

    import Button from '@/components/global/Button.vue';
    import { useMsal } from '@/composables/msal';
    import { loginRequest } from '@/config';
    import { useAuthService } from '@/services/auth.service';
    import { LoginProvider } from '@/types/enums';
    import { type IError } from '@/types/exceptions';

    const { verifyMicrosoftLogin } = useAuthService();
    const emit = defineEmits(['onError', 'login-finished']);

    interface IProps {
        darkModeSupport?: boolean;
    }
    const props = withDefaults(defineProps<IProps>(), {
        darkModeSupport: true,
    });

    const { instance } = useMsal();
    const loginPopup = async () => {
        try {
            const microsoftUser = await instance.loginPopup(loginRequest);
            const authUser = await verifyMicrosoftLogin({ verifyIdDto: { idToken: microsoftUser.idToken } });
            emit('login-finished', authUser, LoginProvider.MICROSOFT);
        } catch (err) {
            if (err instanceof BrowserAuthError) {
                return;
            }
            console.warn(err);
            emit('onError', (err as IError).message);
        }
    };
</script>

<style scoped></style>
