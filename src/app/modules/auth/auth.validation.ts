import { z } from "zod";

// register zod schema
const registerZodSchema = z.object({

    phoneNumber: z
      .string({ message: "Phone number is required" })
      .min(11, { message: "Phone number must be at least 11 digits" })
      .max(14, { message: "Phone number must be at most 14 characters" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 characters" })
      .optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(20, { message: "Password must be at most 20 characters" })
      .optional(),
  })


// login zod schema
const loginZodSchema = z.object({

    identifier: z
      .string({ message: "Phone number or email is required" })
      .min(1, { message: "Identifier is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
  })

// forgot password
const forgotPasswordZodSchema = z.object({

    identifier: z
      .string({ message: "Identifier is required" })
      .min(1, { message: "Identifier is required" }),
  })


// reset password
const resetPasswordZodSchema = z.object({

    identifier: z.string().min(1, { message: "Identifier is required" }),
    token: z.string().min(1, { message: "Token is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })


// send otp
const sendOtpZodSchema = z.object({
    phoneNumber: z
      .string({ message: "Phone number is required" })
      .min(11, { message: "Phone number must be at least 11 digits" }),
  })


// verify otp
const verifyOtpZodSchema = z.object({

    phoneNumber: z
      .string({ message: "Phone number is required" })
      .min(11, { message: "Phone number must be at least 11 digits" }),
    otp: z
      .string({ message: "OTP is required" })
      .length(6, { message: "OTP must be exactly 6 digits" }),
  })


export const AuthValidation = {
  registerZodSchema,
  loginZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  sendOtpZodSchema,
  verifyOtpZodSchema,
};