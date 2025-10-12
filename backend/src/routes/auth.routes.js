import express from "express";
import {
    register,
    login,
    getMyProfile,
    logout,
    //refheshToken,
    verifyEmail
} from "../controller/auth.controller.js";
//faltan los middlewares

const authRouter = express.Router();
authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.post("/auth/logout", logout);
authRouter.get("/auth/me", getMyProfile)
authRouter.get("/auth/verify-email/:token", verifyEmail);

export default authRouter;