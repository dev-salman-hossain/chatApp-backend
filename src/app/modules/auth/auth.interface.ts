export type IRegisterUser = {
    phoneNumber: string;
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

export type ISendOtp = {
    phoneNumber: string;
};

export type IVerifyOtp = {
    phoneNumber: string;
    otp: string;
};

