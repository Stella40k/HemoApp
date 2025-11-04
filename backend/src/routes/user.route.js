import express from "express";
import {
    updateProfile,
    updateDonationStatus,
    desactiveAccount,
    getImpactDashboard
} from "../controller/user.controller.js"
import{
    getOnboardingStep,
    saveOnboardingAnswer,
    getOnboardingProgres
} from "../controller/onboarding.controller.js"
import {authenticateToken} from "../middlewares/auth.middleware.js"
import { updateProfileValidation } from "../middlewares/validations/user.validation.js";

const userRouter = express.Router()
//rutas de perfil validado
userRouter.put("/user/profile", authenticateToken, updateProfileValidation, updateProfile);
userRouter.patch("/user/donation-status", authenticateToken, updateDonationStatus);
userRouter.delete("/user/desactivate", authenticateToken, desactiveAccount);

//rutas del onboarding
userRouter.get("/user/onboarding/next-step", authenticateToken, getOnboardingStep);
userRouter.post("/user/onboarding/answer", authenticateToken, saveOnboardingAnswer);
userRouter.get("/user/onboarding/progress", authenticateToken, getOnboardingProgres);
export default userRouter;

//ruta para el dashboard de donaciones
userRouter.get("/user/impact-dashboard", authenticateToken, getImpactDashboard);

///al servicio deben llegar limpio los datos, se le aplican middlewares tambien