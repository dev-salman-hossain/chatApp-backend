import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.validation.js";

const router : Router = Router();

router.use('auth',AuthRouter);