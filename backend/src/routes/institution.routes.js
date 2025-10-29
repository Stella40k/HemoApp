import express from 'express';
import {authenticateToken} from '../middlewares/auth.middleware.js';
import { requireInstitution, getMyInstitution, updateMyInstitution, getInstitutionById, getPublicInstitutions, getSearchSuggestions } from '../controller/institution.controller.js';

const institutionRouter = express.Router();
//publico
institutionRouter.get("/institutions/public", getPublicInstitutions);
institutionRouter.get("/institutions/:id", getInstitutionById);
institutionRouter.get("/institutions/search/suggestions", getSearchSuggestions);
//protegidas
institutionRouter.get("/institutions/my-institution", authenticateToken, requireInstitution, getMyInstitution);
institutionRouter.put("/institutions/my-institution", authenticateToken, requireInstitution, updateMyInstitution);

export default institutionRouter;