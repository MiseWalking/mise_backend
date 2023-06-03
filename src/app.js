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
import raspberryController from "./raspberry/raspberry.controller.js";
import routeController from "./route/route.controller.js";
import socketIo from "socket.io";
import awsIot from "aws-iot-device-sdk";

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
app.use("/ras", raspberryController);
app.use("/route", routeController);

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
    const server = app.listen(config.port);
    const io = socketIo(server, {
      transport: ["websocket"],
      allowEIO3: true,
    });

    io.on("connect", (socket) => {
      console.log(`클라이언트 연결 성공 - 소켓ID: ${socket.id}`);
      socket.emit("test", "1234");

      const device = awsIot.device({
        keyPath:
          "./mise/aba0adf5d8cf6b57d35e2c81cd186460816403cc3ec079ee3d895117e03d7d24-private.pem.key",
        certPath:
          "./mise/aba0adf5d8cf6b57d35e2c81cd186460816403cc3ec079ee3d895117e03d7d24-certificate.pem.crt",
        caPath: "./mise/AmazonRootCA1.pem",
        clientId: "iotconsole-80cdaf76-ae8c-4c64-8e14-f9e7c76e5d17",
        host: "a1e5htl17m825e-ats.iot.ap-northeast-2.amazonaws.com",
      });

      device.on("connect", function () {
        device.subscribe("sensor");
        socket.emit("deviceConnect", "deviceConnect");
      });

      device.on("message", function (topic, payload) {
        console.log("message", topic, payload.toString());
        socket.emit("message", payload.toString());
      });
    });
  });
});
