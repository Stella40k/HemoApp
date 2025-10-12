import express from "express";
import {
    register,
    login,
    getMyProfile,
    logout,
    verifyEmail,
    refreshToken
} from "../controller/auth.controller.js";
import {
    authenticateToken,
    validateRefreshToken
} from "../middlewares/auth.middleware.js";

const authRouter = express.Router();
//rutas publicas
authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.get("/auth/verify-email/:token", verifyEmail);

//rutas protegidas
authRouter.get("/auth/me", authenticateToken, getMyProfile)
authRouter.post("/auth/logout", authenticateToken, logout);
authRouter.post("/auth/refresh-token", validateRefreshToken, refreshToken)

export default authRouter;