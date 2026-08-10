import { Request, Response } from "express";
import moment from "moment";
import { prisma } from "../db.js";

export const getInfoUser = async (req: Request, res: Response) => {
  try {
    const infoUser = await prisma.infoUser.findUnique({
      where: { userId: req.betterAuthSession.session.userId },
    });

    console.log(infoUser);
    if (!infoUser) {
      return res.json({
        phone: "",
        camera: "",
      });
    }
    return res.json({
      phone: infoUser.phone,
      camera: infoUser.camera,
    });
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res.status(500).json({
      phone: "",
      camera: "",
    });
  }
};

// this check can be done by the front-end
// export const checkHasPhoneAndCamera = async (req: Request, res: Response) => {
//   try {
//     const infoUser = await prisma.infoUser.findUnique({
//       where: { userId: req.betterAuthSession.session.userId },
//     });

//     return res.send(
//       !(infoUser?.phone === undefined || infoUser?.camera === undefined),
//     );
//   } catch (error) {
//     console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
//     return res.status(500).send(false);
//   }
// };

export const updateInfoUser = async (req: Request, res: Response) => {
  try {
    await prisma.infoUser.update({
      where: { userId: req.betterAuthSession.session.userId },
      data: {
        phone: req.body.phone,
        camera: req.body.camera,
      },
    });

    return res.status(200).send();
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res.status(500).send("Eroare interna");
  }
};

export const addInfoUser = async (req: Request, res: Response) => {
  try {
    await prisma.infoUser.create({
      data: {
        userId: req.betterAuthSession.session.userId,
        phone: req.body.phone,
        camera: req.body.camera,
      },
    });

    return res.status(200);
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res
      .status(500)
      .send("Eroare internă. Te rog reîncearcă mai târziu!");
  }
};

export const insertOrUpdateUserInfo = async (req: Request, res: Response) => {
  console.log(req.body);
  if (req.body.phone.length == 0 || req.body.camera.length == 0) {
    return res.send("Wrong Request");
  }
  try {
    await prisma.infoUser.upsert({
      where: {
        userId: req.betterAuthSession.session.userId,
      },
      update: {
        phone: req.body.phone,
        camera: req.body.camera,
      },
      create: {
        userId: req.betterAuthSession.session.userId,
        phone: req.body.phone,
        camera: req.body.camera,
      },
    });
    res.send();
  } catch (err) {
    return res
      .status(500)
      .send("Eroare internă. Te rog reîncearcă mai târziu!");
  }
};
export const getEventsCalendar = async (req: Request, res: Response) => {
  try {
    // Find all events in the database
    const events = await prisma.events.findMany({
      where: { calendar_n: req.body.numberCalendar },
    });

    // Convert the events to the desired format for the calendar
    return res.json(
      events.map((event) => {
        const eventStart = new Date(event.start_event).toISOString();
        const eventEnd = new Date(event.end_event).toISOString();
        const title = event.title + "  " + event.phone + " - " + event.camera;
        return {
          title: title,
          start: eventStart,
          end: eventEnd,
        };
      }),
    );
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res.status(500).json([]);
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    // Find all events in the database
    const events = await prisma.events.findMany();

    // Convert the events to the desired format for the calendar
    return res.json(
      events.map((event) => {
        const eventStart = new Date(event.start_event).toISOString();
        const eventEnd = new Date(event.end_event).toISOString();
        const title = event.title + "  " + event.phone + " - " + event.camera;
        const number = event.calendar_n;
        return {
          id: event.id,
          title: title,
          start: eventStart,
          end: eventEnd,
          number: number,
        };
      }),
    );
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res.status(500).json([]);
  }
};

export const getAllEventsByUser = async (req: Request, res: Response) => {
  try {
    // Find all events in the database
    const events = await prisma.events.findMany({
      where: {
        email: req.betterAuthSession.user.email,
      },
    });

    // Convert the events to the desired format for the calendar
    return res.json(
      events.map((event) => {
        const eventStart = new Date(event.start_event).toISOString();
        const eventEnd = new Date(event.end_event).toISOString();
        const title = event.title + "  " + event.phone + " - " + event.camera;
        const number = event.calendar_n;
        return {
          id: event.id,
          title: title,
          start: eventStart,
          end: eventEnd,
          number: number,
        };
      }),
    );
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res.status(500).json([]);
  }
};
export const deleteEvent = async (req: Request, res: Response) => {
  const eventId = req.body.eventId;
  try {
    // Find the event to deleted
    const findEventToDeleted = await prisma.events.findFirst({
      where: { id: eventId },
    });

    // If the event exits, delete it
    if (findEventToDeleted) {
      const deletedUser = await prisma.events.deleteMany({
        where: { id: eventId },
      });
      if (deletedUser)
        return res.json({ status: true, message: "Event sters" });
      else {
        return res.json({ status: false, message: "Event negasit" });
      }
    } else {
      return res.json({
        status: false,
        message: "Eroare nu poti sterge evenimentul altcuiva!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Eroare. Te rog reincearca mai tarziu!",
    });
  }
};

export const getPhoneAndCamera = async (req: Request, res: Response) => {
  try {
    const infoUser = await prisma.infoUser.findUnique({
      where: { userId: req.betterAuthSession.session.userId },
    });
    if (!infoUser) {
      return res.json({
        phone: "",
        camera: "",
      });
    }

    return res.json({
      phone: infoUser.phone,
      camera: infoUser.camera,
    });
  } catch (error) {
    console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
    return res.status(500).json({
      phone: "",
      camera: "",
    });
  }
};

export const addPersonCalendar = async (req: Request, res: Response) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const number = req.body.number;
  const phone = req.body.phone;
  const camera = req.body.camera;
  try {
    if (new Date(startDate).getTime() < new Date().getTime()) {
      return res.json({
        status: false,
        message: "Nu poti adauga evenimente in trecut!",
      });
    }

    if (
      new Date(endDate).getTime() - new Date(startDate).getTime() >
      8 * 60 * 60 * 1000
    ) {
      return res.json({
        status: false,
        message: "Nu poti adauga un eveniment mai mare de 8 ore!",
      });
    }

    // Check if an event with the provided title (email) already exists
    const existingEvent = await prisma.events.findMany({
      where: { title: req.betterAuthSession.user.name },
    });

    const getAllEvents = await prisma.events.findMany();
    // DANGER
    const checkHasPhoneAndCamera = async (userID: string): Promise<boolean> => {
      try {
        const infoUser = await prisma.infoUser.findUnique({
          where: { userId: userID },
        });

        return !(
          infoUser?.phone === undefined || infoUser?.camera === undefined
        );
      } catch (error) {
        console.error("Eroare internă. Te rog reîncearcă mai târziu!", error);
        return false;
      }
    };
    // DANGET END

    const checkPhoneAndCamera = await checkHasPhoneAndCamera(
      req.betterAuthSession.session.userId,
    );
    if (!checkPhoneAndCamera) {
      return res.json({
        status: false,
        message:
          "Te rog sa completezi datele din profil (camera si numarul de telefon)!",
      });
    }

    for (let i = 0; i < getAllEvents.length; i++) {
      if (getAllEvents[i].calendar_n === number) {
        if (
          new Date(startDate).getTime() ===
          new Date(getAllEvents[i].start_event).getTime()
        ) {
          return res.json({
            status: false,
            message: "Evenimentul se intersecteaza cu un eveniment existent!",
          });
        }
        if (
          new Date(endDate).getTime() ===
          new Date(getAllEvents[i].end_event).getTime()
        ) {
          return res.json({
            status: false,
            message: "Evenimentul se intersecteaza cu un eveniment existent!",
          });
        }
      }

      if (
        (getAllEvents[i].calendar_n === number &&
          new Date(startDate).getTime() >
            new Date(getAllEvents[i].start_event).getTime() &&
          new Date(startDate).getTime() <
            new Date(getAllEvents[i].end_event).getTime()) ||
        (getAllEvents[i].calendar_n === number &&
          new Date(endDate).getTime() >
            new Date(getAllEvents[i].start_event).getTime() &&
          new Date(endDate).getTime() <
            new Date(getAllEvents[i].end_event).getTime()) ||
        (getAllEvents[i].calendar_n === number &&
          new Date(startDate).getTime() <
            new Date(getAllEvents[i].start_event).getTime() &&
          new Date(endDate).getTime() >
            new Date(getAllEvents[i].end_event).getTime()) ||
        (getAllEvents[i].calendar_n === number &&
          (new Date(startDate).getTime() ===
            new Date(getAllEvents[i].start_event).getTime() ||
            new Date(endDate).getTime() ===
              new Date(getAllEvents[i].end_event).getTime()))
      ) {
        return res.json({
          status: false,
          message: "Evenimentul se intersecteaza cu un eveniment existent!",
        });
      }
    }

    //count the number of events at the same week in existingEvent
    let count = 0;
    const start = moment(startDate).startOf("week").toDate();
    const end = moment(startDate).endOf("week").toDate();
    for (let i = 0; i < existingEvent.length; i++) {
      if (
        existingEvent[i].start_event >= start &&
        existingEvent[i].end_event <= end
      ) {
        count++;
      }
    }

    if (count >= 10) {
      return res.json({
        status: false,
        message:
          "Ai adaugat deja numarul maxim de evenimente (10) in aceeasta saptamana!",
      });
    }

    // Insert the new event into the database
    await prisma.events.create({
      data: {
        title: req.betterAuthSession.user.name,
        email: req.betterAuthSession.user.email,
        start_event: new Date(startDate),
        end_event: new Date(endDate),
        calendar_n: number,
        phone: phone,
        camera: camera,
      },
    });

    let masina = "";
    switch (number) {
      case "first":
        masina = "masina 1";
        break;
      case "second":
        masina = "masina 2";
        break;
      case "third":
        masina = "masina 3";
        break;
      case "four":
        masina = "masina 4";
        break;
      default:
        masina = "masina 1";
        break;
    }

    // await this.mailer.send(
    //   context.user!.email,
    //   "Programare spalatorie camin leu - " + masina,
    //   context.user!.name!,
    //   startDate,
    //   endDate,
    //   masina,
    // );

    return res.json({ status: true, message: "S-a adaugat!" });
  } catch (error) {
    console.error("Eroare de conectare la baza de date", error);
    return res.json({
      status: false,
      message: "Eroare interna. Te rog reincearca mai tarziu!",
    });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  try {
    // Find the event to deleted
    const findEventToDeleted = await prisma.events.findFirst({
      where: {
        title: req.betterAuthSession.user.name,
        start_event: req.body.startDate,
        end_event: req.body.endDate,
      },
    });
    // If the event exits, delete it
    if (findEventToDeleted) {
      if (findEventToDeleted.start_event < new Date()) {
        return res.json({
          status: false,
          message: "Nu poti sterge evenimente in trecut!",
        });
      }

      const deletedUser = await prisma.events.deleteMany({
        where: {
          title: req.betterAuthSession.user.name,
          start_event: req.body.startDate,
          end_event: req.body.endDate,
        },
      });
      if (deletedUser)
        return res.json({ status: true, message: "Event sters" });
      else {
        return res.json({ status: false, message: "Event negasit" });
      }
    } else {
      return res.json({
        status: false,
        message: "Eroare nu poti sterge evenimentul altcuiva!",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Eroare. Te rog reincearca mai tarziu!",
    });
  }
};
