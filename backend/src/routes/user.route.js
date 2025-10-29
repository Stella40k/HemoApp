import express from "express";
import {
    updateProfile,
    updateDonationStatus,
    desactiveAccount
} from "../controller/user.controller.js"
import {authenticateToken} from "../middlewares/auth.middleware.js"

const userRouter = express.Router()
userRouter.put("/user/profile", authenticateToken, updateProfile);
userRouter.patch("/user/donation-status", authenticateToken, updateDonationStatus);
userRouter.delete("/user/desactive", authenticateToken, desactiveAccount);

export default userRouter;