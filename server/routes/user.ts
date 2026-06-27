import express from "express";
import {
  addInfoUser,
  addPersonCalendar,
  checkHasPhoneAndCamera,
  deleteEvent,
  deletePerson,
  getAllEvents,
  getEventsCalendar,
  getPhoneAndCamera,
  updateInfoUser,
} from "../controllers/user";
import { routeProtector } from "../middleware/auth";

export const userRouter = express.Router();
userRouter.use(routeProtector);

userRouter.post("/addInfoUser", addInfoUser);
userRouter.get("/checkHasPhoneAndCamera", checkHasPhoneAndCamera);
userRouter.post("/updateInfoUser", updateInfoUser);
userRouter.get("/getEventsCalendar", getEventsCalendar);
userRouter.get("/getAllEvents", getAllEvents);
userRouter.post("/deleteEvent", deleteEvent);
userRouter.get("/getPhoneAndCamera", getPhoneAndCamera);
userRouter.post("/addPersonCalendar", addPersonCalendar);
userRouter.post("/deletePerson", deletePerson);
