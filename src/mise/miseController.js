import express from "express";
import * as miseService from "./miseService.js";

const miseController = express.Router();

miseController.get("/", miseService.getMise);

export default miseController;
