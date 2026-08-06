import { Session, User } from "better-auth/types";
import { NextFunction, Request, Response } from "express";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";

declare module "express-serve-static-core" {
  interface Request {
    betterAuthSession: {
      session: Session;
      user: User;
    };
  }
}

export const routeProtector = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Route protector start");
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (session !== null) {
    req.betterAuthSession = session;
    console.log("Route protector next");
    return next();
  }

  console.log("Route protector end");
  return res.status(403).send();
};
