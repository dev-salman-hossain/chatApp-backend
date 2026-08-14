import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json({ success: true, message: result.message, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);
    const { refreshToken, accessToken } = result;

    // Set Refresh Token in HTTP-Only Cookie
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({ success: true, message: 'User logged in successfully', data: { accessToken } });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error('Refresh token not found');

    const result = await AuthService.refreshToken(refreshToken);

    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    // Update cookie with newly rotated refresh token
    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    res.status(200).json({ success: true, message: 'Token refreshed successfully', data: { accessToken: result.accessToken } });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await AuthService.logoutUser(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.forgotPassword(req.body.identifier);
    res.status(200).json({ success: true, message: result.message, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const result = await AuthService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const result = await AuthService.sendOtp(phoneNumber);
    res.status(200).json({ success: true, message: result.message, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;
    const result = await AuthService.verifyOtp(phoneNumber, otp);
    res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const firebaseLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    const result = await AuthService.verifyFirebaseToken(idToken);
    const { refreshToken, accessToken, user } = result;

    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({ success: true, message: 'Firebase authentication successful', data: { user, accessToken } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  sendOtp,
  verifyOtp,
  firebaseLogin,
  forgotPassword,
  resetPassword,
};