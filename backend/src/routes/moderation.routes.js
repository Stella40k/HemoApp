import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import{
    requireModerator,
    getPendingInstitutions,
    validateInstitucion,
    getAllInstitutions
} from "../controller/moderation.controller.js";

const moderadorRoutes = express.Router();//todas requieren ser moderador
moderadorRoutes.use(authenticateToken, requireModerator),
moderadorRoutes.get("/moderation/institutions/pending", getPendingInstitutions);
moderadorRoutes.post("/moderation/institution/:id/validate", validateInstitucion);
moderadorRoutes.get("/moderation/users", getAllInstitutions);

export default moderadorRoutes;