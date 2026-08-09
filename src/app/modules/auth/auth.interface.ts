export type IRegisterUser = {
    phoneNumber: string;
    email?: string;
    username?: string;
    password?: string;
    avatarUrl?: string;
};

export type ILoginUser = {
    identifier: string;
    password: string;
};

export type IRefreshTokenResponse = {
    accessToken: string;
};

export type ILoginResponse = {
    accessToken: string;
    refreshToken: string;
};

