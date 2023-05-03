import mqtt from "mqtt";
import { config } from "../../config.js";

export async function connectMQTT() {
  const client = mqtt.connect(config.mqttHost, {
    host: config.localHost,
    port: config.mqttPort,
    protocol: "mqtt",
    username: config.userName,
    password: config.password,
  });

  client.on("connect", function () {
    console.log("connected");
    client.publish("presence", "Hello mqtt");
  });

  client.on("message", function (topic, message) {
    console.log(message.toString());
    client.end();
  });
}
