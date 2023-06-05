import awsIot from "aws-iot-device-sdk";

export const getRas = async (req, res) => {
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
    console.log("connect");
    device.subscribe("sensor");
  });

  device.on("message", function (topic, payload) {
    console.log("message", topic, payload.toString());
    return res.status(200).send(payload.toString());
  });
};
