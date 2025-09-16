import express from "express"
import{
    register,
    login,
    logout
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { registerValidation, loginValidation } from "../middlewares/registerValidation.js"

export const authRouter = express.Router();

authRouter.post("/register", registerValidation, validate, register);
authRouter.post("/login", loginValidation, validate, login);
authRouter.post("/logout", logout)