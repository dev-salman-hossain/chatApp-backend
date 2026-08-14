import { Request, Response } from 'express';
declare const registerUser: (req: Request, res: Response) => Promise<void>;
declare const loginUser: (req: Request, res: Response) => Promise<void>;
declare const refreshToken: (req: Request, res: Response) => Promise<void>;
declare const logoutUser: (req: Request, res: Response) => Promise<void>;
declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
declare const resetPassword: (req: Request, res: Response) => Promise<void>;
declare const sendOtp: (req: Request, res: Response) => Promise<void>;
declare const verifyOtp: (req: Request, res: Response) => Promise<void>;
declare const firebaseLogin: (req: Request, res: Response) => Promise<void>;
export declare const AuthController: {
    registerUser: typeof registerUser;
    loginUser: typeof loginUser;
    refreshToken: typeof refreshToken;
    logoutUser: typeof logoutUser;
    sendOtp: typeof sendOtp;
    verifyOtp: typeof verifyOtp;
    firebaseLogin: typeof firebaseLogin;
    forgotPassword: typeof forgotPassword;
    resetPassword: typeof resetPassword;
};
export {};
//# sourceMappingURL=auth.controller.d.ts.map