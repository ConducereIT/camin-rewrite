import express, { Request, Response } from "express";
import {
  addPersonCalendar,
  deleteEvent,
  deletePerson,
  getAllEvents,
  getEventsCalendar,
  getPhoneAndCamera,
  insertOrUpdateUserInfo,
  updateInfoUser,
} from "../controllers/user.js";
import { routeProtector } from "../middleware/auth.js";

export const userRouter = express.Router();
userRouter.use(routeProtector);

userRouter.post("/insertOrUpdateUserInfo", insertOrUpdateUserInfo);
// userRouter.post("/addInfoUser", addInfoUser);
// userRouter.get("/checkHasPhoneAndCamera", checkHasPhoneAndCamera);
// userRouter.post("/updateInfoUser", updateInfoUser);
userRouter.post("/getEventsCalendar", getEventsCalendar);
userRouter.get("/getAllEvents", getAllEvents);
// userRouter.post("/deleteEvent", deleteEvent);
userRouter.get("/getPhoneAndCamera", getPhoneAndCamera);
userRouter.post("/addPersonCalendar", addPersonCalendar);
// userRouter.post("/deletePerson", deletePerson);
