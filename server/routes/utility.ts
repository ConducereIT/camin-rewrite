import express, { Request, Response } from "express";
import { isMaintenanceController } from "../controllers/utility";

export const utilityRouter = express.Router();

utilityRouter.get("/isMaintenance", isMaintenanceController);
utilityRouter.get("/ok", (req: Request, res: Response) => {
  return res.json({ ok: true });
});
