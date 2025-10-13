import express from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.route.js';

export const routes = express.Router();
routes.use(authRouter);
routes.use(userRouter);