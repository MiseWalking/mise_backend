import * as raspberryService from "./raspberry.service.js";
import express from "express";

const raspberryController = express.Router();

raspberryController.get("/", raspberryService.getRas);

export default raspberryController;
