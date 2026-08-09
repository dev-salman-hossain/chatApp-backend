
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import config from '../../config/env.js';
import { jwtHelpers } from '../../helpers/jwtHelpers.js';
import { ILoginResponse, ILoginUser, IRegisterUser } from './auth.interface.js';

const prisma = new PrismaClient();

// Secrets & Expiry (Should come from .env in production)
const JWT_ACCESS_SECRET = config.jwt_access_token_secret;
const JWT_REFRESH_SECRET = config.jwt_refresh_token_secret;
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

const registerUser = async (payload: IRegisterUser) => {
  const { password, ...userData } = payload;
  
  let hashedPassword: string | undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }
  
  // Create User but exclude password from response
  const newUser = await prisma.user.create({
    data: {
      ...userData,
      ...(hashedPassword && { password: hashedPassword }),
    },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      username: true,
      createdAt: true,
    }
  });

  return newUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginResponse> => {
  const { identifier, password } = payload;

  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phoneNumber: identifier }],
    },
  });

  if (!user || !user.password) {
    throw new Error('User does not exist or invalid credentials');
  }

  // Verify password
  const isPasswordMatched = await bcrypt.compare(password!, user.password);
  if (!isPasswordMatched) {
    throw new Error('Password does not match');
  }

  // Generate Tokens
  const jwtPayload = { userId: user.id, phoneNumber: user.phoneNumber };
  const accessToken = jwtHelpers.createToken(jwtPayload, JWT_ACCESS_SECRET, ACCESS_EXPIRES_IN);
  const refreshToken = jwtHelpers.createToken(jwtPayload, JWT_REFRESH_SECRET, REFRESH_EXPIRES_IN);

  // Save Session in DB
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  // Verify token signature
  let verifiedToken;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error('Invalid Refresh Token');
  }

  // Check if session exists in DB (Security layer)
  const session = await prisma.session.findUnique({
    where: { refreshToken: token },
  });

  if (!session) {
    throw new Error('Session is inactive or invalid');
  }

  const { userId } = verifiedToken;
  
  // Token Rotation: Generate new tokens
  const jwtPayload = { userId };
  const newAccessToken = jwtHelpers.createToken(jwtPayload, JWT_ACCESS_SECRET, ACCESS_EXPIRES_IN);
  const newRefreshToken = jwtHelpers.createToken(jwtPayload, JWT_REFRESH_SECRET, REFRESH_EXPIRES_IN);

  // Update session with new refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshToken: newRefreshToken, expiresAt },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logoutUser = async (refreshToken: string) => {
  // Delete the session from DB
  await prisma.session.deleteMany({
    where: { refreshToken },
  });
  return null;
};

const forgotPassword = async (identifier: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phoneNumber: identifier }] },
  });

  if (!user) throw new Error('User not found');

  // Generate OTP/Token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt,
    },
  });

  // TODO: Send token via SMS/Email using preferred service (Twilio/Nodemailer)
  return { message: 'Reset token generated successfully', token: resetToken }; 
};

const resetPassword = async (token: string, newPassword: string) => {
  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    throw new Error('Token is invalid or expired');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password and Invalidate ALL sessions (Security Best Practice)
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.delete({ where: { id: resetRecord.id } }),
    prisma.session.deleteMany({ where: { userId: resetRecord.userId } }), // Kick out from all devices
  ]);

  return { message: 'Password reset successful' };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};