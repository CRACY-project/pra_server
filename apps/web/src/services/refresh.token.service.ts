import { api } from '@/config';
import { useAuthStore } from '@/stores/auth.store';

export function useRefreshTokenService() {
    async function getNewRefreshToken() {
        const response = await fetch(`${api}/auth/refresh`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.status === 401) {
            const { refreshTokenIsExpired } = useAuthStore();
            refreshTokenIsExpired();
            throw new Error('Unauthorized');
        }

        // when the response is not ok (200-299) throw an error
        if (response.status < 200 || response.status >= 300) {
            return;
        }

        const tokens = await response.json();

        return tokens.accessToken;
    }
    return {
        getNewRefreshToken,
    };
}
