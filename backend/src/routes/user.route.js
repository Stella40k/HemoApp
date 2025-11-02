import express from "express";
import {
    updateProfile,
    updateDonationStatus,
    desactiveAccount
} from "../controller/user.controller.js"
import{
    getOnboardingStep,
    saveOnboardingAnswer,
    getOnboardingProgres
} from "../controller/onboarding.controller.js"
import {authenticateToken} from "../middlewares/auth.middleware.js"

const userRouter = express.Router()
userRouter.put("/user/profile", authenticateToken, updateProfile);
userRouter.patch("/user/donation-status", authenticateToken, updateDonationStatus);
userRouter.delete("/user/desactive", authenticateToken, desactiveAccount);

//rutas del onboarding
userRouter.get("/user/onboarding/next-step", authenticateToken, getOnboardingStep);
userRouter.post("/user/onboarding/answer", authenticateToken, saveOnboardingAnswer);
userRouter.get("/user/onboarding/progress", authenticateToken, getOnboardingProgres);
export default userRouter;


///al servicio deben llegar limpio los datos, se le aplican middlewares tambien