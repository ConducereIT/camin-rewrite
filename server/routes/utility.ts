import express from "express";
import { isMaintenanceController } from "../controllers/utility";

export const utilityRouter = express.Router();

utilityRouter.get("/isMaintenance", isMaintenanceController);
