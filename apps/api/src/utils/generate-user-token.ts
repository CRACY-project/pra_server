import { randomInt } from 'crypto';

export function generateUserToken(): string {
    return randomInt(100000, 1000000).toString();
}
