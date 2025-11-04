import express from 'express';
import authRouter from './auth.routes.js';
import userRouter from './user.route.js';
import institutionRouter from './institution.routes.js'
import moderadorRoutes from './moderation.routes.js'
import donationRouter from './donation.routes.js'

export const routes = express.Router();
routes.use(authRouter);
routes.use(userRouter);
routes.use(institutionRouter);
routes.use(moderadorRoutes);
routes.use(donationRouter);