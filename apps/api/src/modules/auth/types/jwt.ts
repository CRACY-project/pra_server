export interface IAccessTokenData {
    userId: number;
    roles: string[];
}

export interface IRefreshTokenData {
    userId: number;
    exp?: number;
    iat?: number;
}
