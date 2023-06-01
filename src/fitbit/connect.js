import FitbitApiClient from "fitbit-node";
import express from "express";
import Redis from "redis";
import { config } from "../../config.js";

const fitbitController = express.Router();
const fitbitClient = new FitbitApiClient({
  clientId: config.fitbitClId,
  clientSecret: config.fitbitSecret,
  apiVersion: "1.2",
});

fitbitController.get("/authorize", (req, res) => {
  res.redirect(
    fitbitClient.getAuthorizeUrl(
      "activity heartrate location nutrition profile settings sleep social weight",
      config.fitbitUrl
    )
  );
});

fitbitController.get("/callback", async (req, res) => {
  await fitbitClient
    .getAccessToken(req.query.code, config.fitbitUrl)
    .then(async (result) => {
      const redisClient = Redis.createClient(6379, "localhost");
      await redisClient.connect();
      await redisClient.set("token", result.access_token);
      res.json(result.access_token);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

//사용자 정보
fitbitController.get("/userInfo", async (req, res) => {
  const accessToken = await getAccessToken();
  fitbitClient
    .get("/profile.json", accessToken)
    .then((results) => {
      res.json(results[0]);
    })
    .catch((err) => {
      console.log(err);
      res.status(err.status).send(err);
    });
});

fitbitController.get("/fatInfo", async (req, res) => {
  const accessToken = await getAccessToken();
  const fatInfo = await fitbitClient.get(
    "/body/log/fat/date/2023-05-12.json",
    accessToken
  );
  const weightInfo = await fitbitClient.get(
    "/body/log/weight/date/2023-05-12.json",
    accessToken
  );

  const resJson = { fatInfo, weightInfo };
  console.log(resJson);
  res.json(resJson);
});

fitbitController.get("/dailyActivity", async (req, res) => {
  const accessToken = await getAccessToken();
  let resJson = {};
  fitbitClient
    .get("/activities/date/2023-05-22.json", accessToken)
    .then((results) => {
      resJson.activities = results[0];
      res.json(resJson);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

fitbitController.get("/getActivityLogList", async (req, res) => {
  const accessToken = await getAccessToken();
  let resJson = {};
  fitbitClient
    .get(
      "/activities/list.json?afterDate=2023-05-01&sort=asc&offset=0&limit=2",
      accessToken
    )
    .then((results) => {
      resJson.activities = results[0];
      res.json(resJson);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});
//https://dev.fitbit.com/build/reference/web-api/activity/get-activity-tcx/ 위에서 가져와서 로그로 검색

async function getAccessToken() {
  const redisClient = Redis.createClient(6379, "localhost");
  await redisClient.connect();
  const token = await redisClient.get("token");
  if (token) return token;
  else return -1;
}

export default fitbitController;
