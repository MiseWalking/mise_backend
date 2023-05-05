import express from "express";
import * as dataService from "./dataService.js";

const dataController = express.Router();

dataController.get("/", dataService.getMise);
dataController.get("/mise", dataService.getMise2);
dataController.get("/weather", dataService.getWeather);
dataController.get("/gang", dataService.getGang);

export default dataController;
