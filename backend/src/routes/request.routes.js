import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { createBloodRequest } from "../controller/request.controller.js";

const requestRouter = express.Router();

// solo usuarios autenticados (familiares/pacientes) pueden crear una solicitud
requestRouter.post("/requests/new", authenticateToken, createBloodRequest);
// requestRouter.get("/requests/me", authenticateToken, getMyRequests);

export default requestRouter;
