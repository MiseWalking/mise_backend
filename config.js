import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT),
  mqttHost: process.env.mqttHost,
  localHost: process.env.localHost,
  mqttPort: parseInt(process.env.mqttPort),
  userName: process.env.userName,
  password: process.env.password,
};
