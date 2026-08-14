import { z } from "zod";
export declare const AuthValidation: {
    registerZodSchema: z.ZodObject<{
        phoneNumber: z.ZodString;
        username: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    loginZodSchema: z.ZodObject<{
        identifier: z.ZodString;
        password: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    forgotPasswordZodSchema: z.ZodObject<{
        identifier: z.ZodString;
    }, z.core.$strip>;
    resetPasswordZodSchema: z.ZodObject<{
        identifier: z.ZodString;
        token: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
    sendOtpZodSchema: z.ZodObject<{
        phoneNumber: z.ZodString;
    }, z.core.$strip>;
    verifyOtpZodSchema: z.ZodObject<{
        phoneNumber: z.ZodString;
        otp: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=auth.validation.d.ts.map