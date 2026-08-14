import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";


const router : Router = Router();

router.use('/auth',AuthRouter);

export default router;