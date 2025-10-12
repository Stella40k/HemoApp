import express from 'express';
import authRouter from './auth.routes.js';

export const routes = express.Router();
routes.use(authRouter);