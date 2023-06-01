import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { connectMQTT } from "./mqtt/connect.js";
import { config } from "../config.js";
import dataController from "./mise/dataController.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./db/database.js";
import userController from "./user/user.controller.js";
import fitbitController from "./fitbit/connect.js";
import weightController from "./weight/weight.controller.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "MiseWalking",
    version: "1.0.0",
    description: "클라우드 IOT Swagger 문서",
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// api 문서
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
  })
);

app.use("/data", dataController);
app.use("/user", userController);
app.use("/fitbit", fitbitController);
app.use("/weight", weightController);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

connectDB().then(() => {
  console.log("MongoDB Connected");
  connectMQTT().then(() => {
    console.log("MQTT Connected");
    app.listen(config.port);
  });
});
