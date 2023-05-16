import FitbitApiClient from "fitbit-node";
import express from "express";
import { config } from "../../config.js";

const fitbitController = express.Router();
const client = new FitbitApiClient({
  clientId: config.fitbitClId,
  clientSecret: config.fitbitSecret,
  apiVersion: "1.2",
});

fitbitController.get("/authorize", (req, res) => {
  res.redirect(
    client.getAuthorizeUrl(
      "activity heartrate location nutrition profile settings sleep social weight",
      "http://localhost:5000/fitbit/callback"
    )
  );
});

fitbitController.get("/callback", async (req, res) => {
  await client
    .getAccessToken(req.query.code, "http://localhost:5000/fitbit/callback")
    .then((result) => {
      client
        .get("/profile.json", result.access_token)
        .then((results) => {
          res.send(results[0]);
        })
        .catch((err) => {
          res.status(err.status).send(err);
        });
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

export default fitbitController;
