import { type AuthUser, UserCompanyRoleValue } from '@cracy/typescript-client';
import { notify } from '@kyvg/vue3-notification';
import { defineStore } from 'pinia';

import { useAuthService } from '@/services/auth.service';
import { LoginProvider } from '@/types/enums';

interface IState {
    user: AuthUser | null;
    accessToken: string | null;
    loginProvider?: LoginProvider;
}

export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Eduardo' }),
    getters: {
        doubleCount: state => state.count * 2,
    },
    actions: {
        increment() {
            this.count++;
        },
    },
});

export const useAuthStore = defineStore('auth', {
    state: (): IState => {
        return {
            user: null,
            accessToken: null,
            loginProvider: LoginProvider.NONE,
        };
    },
    actions: {
        setAccessToken(accessToken: string) {
            this.accessToken = accessToken;
        },
        setUser(user: AuthUser) {
            this.user = user;
        },
        setLoginProvider(loginProvider: LoginProvider) {
            this.loginProvider = loginProvider;
        },
        clearUser() {
            this.user = null;
            this.accessToken = null;
            this.loginProvider = LoginProvider.NONE;
        },
        logout() {
            this.clearUser();
            this.router.push('/logout');
        },
        refreshTokenIsExpired() {
            this.clearUser();
            if (this.router.currentRoute.value.name === 'login') {
                // there seems to be an issue with this code being called even if the user is already on the login page.
                // Api calls are after all async and can take seconds to complete.
                return;
            }
            this.router.push({
                name: 'login',
                query: { redirect: this.router.currentRoute.value.fullPath },
            });
        },
        accessDenied() {
            this.user = null;
            this.accessToken = null;
            this.loginProvider = LoginProvider.NONE;
        },
        async initUser(user: AuthUser, loginProvider: LoginProvider, redirectUrl?: string) {
            this.setUser(user);
            this.setAccessToken(user.accessToken || '');
            this.setLoginProvider(loginProvider);

            if (redirectUrl) {
                this.router.push(redirectUrl);
                return;
            }

            if (
                user.userRoles?.some(role => {
                    if (role.value === UserCompanyRoleValue.COMPANYADMIN) return true;
                })
            ) {
                this.router.push(`/${user.company.name}/dashboard`);
                return;
            }
            notify({
                text: "You don't have permission to access this page",
                type: 'error',
            });
            this.accessDenied();
        },
        async refreshUserInfo() {
            const { getMe } = useAuthService();
            const user = await getMe();
            this.setUser(user);
        },
    },
    persist: true,
});
