import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { prisma } from "./db";
import { utilityRouter } from "./routes/utility";
import { userRouter } from "./routes/user";

const app = express();
const port = 8881;

dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", utilityRouter);
app.use("/api/user", userRouter);

app.all("/api/auth/{*any}", toNodeHandler(auth));

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  prisma.user.findFirst().then((data) => console.log(data));
  prisma.$connect().catch((e) => {
    console.error("CANT REACH DB");
    console.error(e);
    process.exit(1);
  });
});
const shutDownServer = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutDownServer);
process.on("SIGTERM", shutDownServer);
