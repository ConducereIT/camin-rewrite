import  express from "express";
import * as genezioAdapters from "@genezio/adapters";
import morgan from "morgan"
import { BackendService } from "./backend"
import cors from "cors";
const app = express();
const port = 8881;
import dotenv from 'dotenv';

dotenv.config();


app.use(cors());
app.use(morgan("dev"))
app.use(express.json());
app.post("/genezio", genezioAdapters.createExpressRouter([BackendService]));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});