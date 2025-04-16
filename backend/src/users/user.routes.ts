
import { Router } from "express"
import * as userController from "./user.controller"
import { authenticateToken } from "../services/middlewares/auth.middleware";


const router = Router();

router.get("/me", authenticateToken, userController.getMe);
router.patch("/updateProfile", authenticateToken, userController.updateUserData);

export default router;
