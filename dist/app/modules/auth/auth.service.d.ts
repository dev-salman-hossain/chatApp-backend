import { ILoginResponse, ILoginUser, IRegisterUser } from './auth.interface.js';
declare const registerUser: (payload: IRegisterUser) => Promise<{
    user: {
        createdAt: Date;
        id: string;
        isVerified: boolean;
        phoneNumber: string;
        username: string | null;
    };
    message: string;
    otp: string;
}>;
declare const loginUser: (payload: ILoginUser) => Promise<ILoginResponse>;
declare const refreshToken: (token: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
declare const logoutUser: (refreshToken: string) => Promise<null>;
declare const forgotPassword: (identifier: string) => Promise<{
    message: string;
    token: string;
}>;
declare const resetPassword: (token: string, newPassword: string) => Promise<{
    message: string;
}>;
declare const sendOtp: (phoneNumber: string) => Promise<{
    message: string;
    otp: string;
    expiresAt: Date;
}>;
declare const verifyOtp: (phoneNumber: string, otp: string) => Promise<{
    message: string;
}>;
declare const verifyFirebaseToken: (idToken: string) => Promise<{
    user: {
        id: string;
        phoneNumber: string;
        email: string | null;
        username: string | null;
        password: string | null;
        avatarUrl: string | null;
        isVerified: boolean;
        isOnline: boolean;
        lastSeen: Date;
        createdAt: Date;
        updatedAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare const AuthService: {
    registerUser: typeof registerUser;
    loginUser: typeof loginUser;
    refreshToken: typeof refreshToken;
    logoutUser: typeof logoutUser;
    sendOtp: typeof sendOtp;
    verifyOtp: typeof verifyOtp;
    verifyFirebaseToken: typeof verifyFirebaseToken;
    forgotPassword: typeof forgotPassword;
    resetPassword: typeof resetPassword;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map