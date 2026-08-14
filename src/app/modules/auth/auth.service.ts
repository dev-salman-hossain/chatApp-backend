
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import config from '../../config/env.js';
import { jwtHelpers } from '../../helpers/jwtHelpers.js';
import { ILoginResponse, ILoginUser, IRegisterUser } from './auth.interface.js';
import prisma from '../../lib/prisma.js';
import { getFirebaseAuth } from '../../lib/firebaseAdmin.js';
import AppError from '../../shared/errors/AppError.js';

// Secrets & Expiry (Should come from .env in production)
const JWT_ACCESS_SECRET = config.jwt_access_token_secret;
const JWT_REFRESH_SECRET = config.jwt_refresh_token_secret;
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

const registerUser = async (payload: IRegisterUser) => {
  const { password, username, phoneNumber, ...userData } = payload;

  // 1. Check if phone number is already registered
  const existingPhone = await prisma.user.findUnique({
    where: { phoneNumber },
  });
  if (existingPhone) {
    throw new AppError(400, 'User with this phone number already exists');
  }

  // 2. Fallback username generation or check existing username
  let finalUsername = username;
  if (!finalUsername) {
    finalUsername = `user_${phoneNumber.slice(-6)}_${Math.floor(100 + Math.random() * 900)}`;
  } else {
    const existingUsername = await prisma.user.findUnique({
      where: { username: finalUsername },
    });
    if (existingUsername) {
      throw new AppError(400, 'Username is already taken. Please choose another username.');
    }
  }

  let hashedPassword: string | undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }

  // 3. Create User
  const newUser = await prisma.user.create({
    data: {
      phoneNumber,
      username: finalUsername,
      ...(hashedPassword && { password: hashedPassword }),
      ...userData,
    },
    select: {
      id: true,
      phoneNumber: true,
      username: true,
      isVerified: true,
      createdAt: true,
    },
  });

  // Auto generate 6-digit numeric OTP for phone verification
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes validity

  // Save OTP in DB
  await prisma.otp.create({
    data: {
      phoneNumber: newUser.phoneNumber,
      otp,
      expiresAt,
    },
  });

  return {
    user: newUser,
    message: "User registered successfully. OTP sent for phone verification.",
    otp, // Useful for testing & development
  };
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
    throw new AppError(400, 'User does not exist or invalid credentials');
  }

  // Verify password
  const isPasswordMatched = await bcrypt.compare(password!, user.password);
  if (!isPasswordMatched) {
    throw new AppError(400, 'Password does not match');
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

const sendOtp = async (phoneNumber: string) => {
  // Generate 6-digit numeric OTP using popular 'otp-generator' package
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

  // Save OTP in DB
  await prisma.otp.create({
    data: {
      phoneNumber,
      otp,
      expiresAt,
    },
  });

  return {
    message: 'OTP sent successfully',
    otp, // Useful for testing / response
    expiresAt,
  };
};

const verifyOtp = async (phoneNumber: string, otp: string) => {
  const otpRecord = await prisma.otp.findFirst({
    where: {
      phoneNumber,
      otp,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }

  // Update user as verified if user already exists
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
  }

  // Delete used OTPs for this phone number
  await prisma.otp.deleteMany({
    where: { phoneNumber },
  });

  return { message: 'Phone number verified successfully' };
};

const verifyFirebaseToken = async (idToken: string) => {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    throw new Error('Firebase Admin SDK credentials not configured in .env');
  }

  const decodedToken = await firebaseAuth.verifyIdToken(idToken);
  const phoneNumber = decodedToken.phone_number;

  if (!phoneNumber) {
    throw new Error('Phone number not found in Firebase token');
  }

  // Find or create user with verified status
  let user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phoneNumber,
        username: `user_${phoneNumber.slice(-6)}_${Math.floor(100 + Math.random() * 900)}`,
        isVerified: true,
      },
    });
  } else if (!user.isVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
  }

  // Generate App Tokens
  const jwtPayload = { userId: user.id, phoneNumber: user.phoneNumber };
  const accessToken = jwtHelpers.createToken(jwtPayload, JWT_ACCESS_SECRET, ACCESS_EXPIRES_IN);
  const refreshToken = jwtHelpers.createToken(jwtPayload, JWT_REFRESH_SECRET, REFRESH_EXPIRES_IN);

  // Save active session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt,
    },
  });

  return { user, accessToken, refreshToken };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  sendOtp,
  verifyOtp,
  verifyFirebaseToken,
  forgotPassword,
  resetPassword,
};