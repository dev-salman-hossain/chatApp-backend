import z, { email } from "zod";

// register zod schema
const registerZodSchema = z.object({
    phoneNumber: z.string().min(11, { message: "Phone number must be 11 digits" }).max(11, { message: "Phone number must be 11 digits" }),
    email : z.email().optional(),
    username : z.string().min(3, { message: "Username must be at least 3 characters" }).max(20, { message: "Username must be at most 20 characters" }),
    password : z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be at most 20 characters" }),
})

// login zod schema
const loginZodSchema = z.object({
    identifier: z.string().min(11, { message: "Phone number must be 11 digits" }).max(11, { message: "Phone number must be 11 digits" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be at most 20 characters" }),
})

// forgot password
const forgotPasswordZodSchema = z.object({
    identifier: z.string().min(11, { message: "Phone number must be 11 digits" }).max(11, { message: "Phone number must be 11 digits" }),
})

// reset password
const resetPasswordZodSchema = z.object({
    identifier: z.string().min(11, { message: "Phone number must be 11 digits" }).max(11, { message: "Phone number must be 11 digits" }),
    token: z.string().min(1, { message: "Token is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be at most 20 characters" }),
})

export const AuthValidation = {
    registerZodSchema,
    loginZodSchema,
    forgotPasswordZodSchema,
    resetPasswordZodSchema
    
}