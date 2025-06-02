<template>
    <div
        :key="isDark ? 'dark' : 'light'"
        ref="googleSignInWrapper"
        :class="{ 'dark: dark: rounded-md dark:border': props.darkModeSupport }"
        class="googleSignInWrapper overflow-hidden"
    >
        <div
            id="g_id_onload"
            :data-client_id="googleClientId"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="handleGoogleSignIn"
            data-auto_prompt="false"
            data-itp_support="false"
            data-use_fedcm_for_prompt="true"
            data-nonce="NGINX_CSP_NONCE"
        ></div>
        <div
            class="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            :data-theme="isDark && props.darkModeSupport ? 'filled_black' : 'filled_white'"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left"
            data-width="384"
        ></div>
    </div>
</template>

<script lang="ts" setup>
    import { notify } from '@kyvg/vue3-notification';
    import { useDark } from '@vueuse/core';
    import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';

    import { useAuthService } from '@/services/auth.service';
    import { LoginProvider } from '@/types/enums';
    import { type IError } from '@/types/exceptions';

    import { MountGsiScript } from './GsiLogin';

    const { verifyGoogleLogin } = useAuthService();
    const emit = defineEmits(['update:modelValue', 'onError', 'login-finished']);
    const googleSignInWrapper = ref<HTMLDivElement | null>(null);

    const googleClientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;
    const handleGoogleSignIn = async (googleUser: any) => {
        try {
            const authUser = await verifyGoogleLogin({ verifyIdDto: { idToken: googleUser.credential } });
            emit('login-finished', authUser, LoginProvider.GOOGLE);
        } catch (error) {
            const msg = (error as IError).message;
            notify({
                text: msg ? msg.toString() : `If this issue persists, please contact your administrator.`,
                type: 'error',
            });
        }
    };

    interface IProps {
        darkModeSupport?: boolean;
    }
    const props = withDefaults(defineProps<IProps>(), {
        darkModeSupport: true,
    });
    const isDark = useDark();

    onBeforeMount(() => {
        // @ts-expect-error - global function
        window.handleGoogleSignIn = handleGoogleSignIn;
    });
    onMounted(() => {
        if (googleSignInWrapper.value) {
            MountGsiScript(googleSignInWrapper.value);
        }
    });
    onBeforeUnmount(() => {
        // @ts-expect-error - global function
        window.handleGoogleSignIn = undefined;
    });
</script>

<style scoped></style>
