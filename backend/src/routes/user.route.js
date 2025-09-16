import express from "express";
import{
    getUsers,
    getUser,
    updateUser,
    deactivateUser
} from "../controllers/user.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"