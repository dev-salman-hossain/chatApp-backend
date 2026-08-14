import { Router } from "express";
import { AuthRouter } from "../modules/auth/auth.route.js";
const router = Router();
router.use('/auth', AuthRouter);
export default router;
//# sourceMappingURL=index.js.map