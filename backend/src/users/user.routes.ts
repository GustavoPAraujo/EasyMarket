
import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { authenticateToken } from "../../auth_services/src/middlewares/auth.middleware";


const router = Router();

router.get("/me", authenticateToken, userController.getMe);
router.patch("/updateProfile", authenticateToken, userController.updateUserData);

export default router;
