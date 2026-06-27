import { Request, Response } from "express";
import { prisma } from "../db";

export const isMaintenanceController = async (req: Request, res: Response) => {
  try {
    const maintenance = await prisma.maintenance.findFirst();
    if (maintenance) {
      return res.json({ status: maintenance.status, date: maintenance.date });
    }
    return res.json({ status: false, date: new Date() });
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res.json({ status: false, date: new Date() });
  }
};
