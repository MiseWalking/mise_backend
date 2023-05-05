import express from "express";
import * as dataService from "./dataService.js";

const dataController = express.Router();

dataController.get("/", dataService.getMise);
dataController.get("/mise", dataService.getMise2);

export default dataController;
