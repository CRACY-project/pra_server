<template>
    <div class="relative flex h-screen max-h-screen overflow-hidden dark:bg-white">
        <div class="relative hidden h-screen w-6/12 flex-1 overflow-hidden p-2 md:flex lg:block lg:w-1/2">
            <div class="relative flex h-full content-center overflow-hidden rounded-lg bg-tertiary-200">
                <div class="m-auto h-[fit-content] w-[fit-content]">
                    <div class="w-[fit-content]">
                        <h1 class="py-6 tracking-tight text-primary-500 lg:text-5xl xl:text-6xl xxl:text-7xl">
                            <p class="py-5">Welcome to the <br /></p>
                            <div class="w-[fit-content] -rotate-[2deg] rounded-lg bg-white p-2 font-bold">
                                <!-- <div class="rotate-[2deg]">PDE Risk Analyzer</div> -->
                                <div class="rotate-[2deg]">PRA Platform</div>
                            </div>
                        </h1>
                        <p class="py-3 font-semibold text-primary-500 xl:text-xl">
                            PDE Risk Analyzer helps you create secure PDEs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-[10%] flex flex-1 flex-col px-4 py-12 lg:w-1/2 lg:px-0">
            <div v-if="!user">
                <div class="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <img :src="CracyLogoSmall" class="mx-auto w-64" />
                        <h2 class="mt-6 text-xl font-bold tracking-tight text-primary-500 md:text-3xl">
                            {{ showExternalLogins ? 'Sign in to your account' : 'Verification code' }}
                        </h2>
                        <p v-if="error" class="mt-1 text-red-500">{{ error }}</p>
                    </div>

                    <div class="mb-5 mt-8">
                        <div>
                            <div>
                                <div class="mt-1 flex flex-col space-y-3">
                                    <GoogleLogin
                                        v-if="!user && showExternalLogins"
                                        :dark-mode-support="false"
                                        @on-error="setError"
                                        @login-finished="initUser"
                                    />
                                    <MsalLogin
                                        v-if="showExternalLogins"
                                        :dark-mode-support="false"
                                        @login-finished="initUser"
                                        @on-error="setError"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { type AuthUser, PlatformUserRoleValue, UserCompanyRoleValue } from '@cracy/typescript-client';
    import { onBeforeMount, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import CracyLogoSmall from '@/assets/cracy-small.svg';
    import GoogleLogin from '@/components/login/GoogleLogin.vue';
    import MsalLogin from '@/components/login/MsalLogin.vue';
    import { useAuthStore } from '@/stores/auth.store';
    import { LoginProvider } from '@/types/enums';

    const router = useRouter();
    const authStore = useAuthStore();

    const user = ref<AuthUser>();
    const loginProvider = ref<LoginProvider>();
    const error = ref<string | null>(null);
    const route = useRoute();
    const setError = (err: string) => {
        error.value = err;
    };

    const initUser = async (authUser: AuthUser, authLoginProvider: LoginProvider) => {
        user.value = authUser;
        loginProvider.value = authLoginProvider;

        login();
    };

    onBeforeMount(async () => {
        const user = authStore.user;
        if (!user) return;

        if (hasUserRole()) {
            router.push({ name: 'security-panel' });
        }
    });

    const showExternalLogins = ref(true);

    const login = () => {
        let redirectUri;
        if (route.query.redirect) {
            redirectUri = route.query.redirect.toString();
        }

        if (user.value && loginProvider.value) authStore.initUser(user.value, loginProvider.value, redirectUri);
    };

    const hasUserRole = () => {
        if (user.value && user.value.platformRole === PlatformUserRoleValue.USER && user.value.userRoles) {
            const roleInCompany = user.value.userRoles.find(role => role.companyId === user.value?.company.id);

            if (roleInCompany?.value === UserCompanyRoleValue.USER) {
                return true;
            }
        }

        return false;
    };
</script>

<style scoped></style>
