import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import tweetController from "./test/test.controller.js";
import { config } from "../config.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use("/test", tweetController);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

app.listen(config.port);
