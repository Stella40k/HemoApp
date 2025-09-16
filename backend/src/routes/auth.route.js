import express from "express"
import{
    register,
    login,
    logout
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import { registerValidation } from "../middlewares"