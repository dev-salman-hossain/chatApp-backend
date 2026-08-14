import { Router } from "express";
import { AuthValidation } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
const router = Router();
router.post('/send-otp', validateRequest(AuthValidation.sendOtpZodSchema), AuthController.sendOtp);
router.post('/verify-otp', validateRequest(AuthValidation.verifyOtpZodSchema), AuthController.verifyOtp);
router.post('/firebase-login', AuthController.firebaseLogin);
router.post('/register', validateRequest(AuthValidation.registerZodSchema), AuthController.registerUser);
router.post('/login', validateRequest(AuthValidation.loginZodSchema), AuthController.loginUser);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logoutUser);
router.post('/forgot-password', validateRequest(AuthValidation.forgotPasswordZodSchema), AuthController.forgotPassword);
router.post('/reset-password', validateRequest(AuthValidation.resetPasswordZodSchema), AuthController.resetPassword);
export const AuthRouter = router;
//# sourceMappingURL=auth.route.js.map