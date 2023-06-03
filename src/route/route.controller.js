import * as routeService from "./route.service.js";
import express from "express";

const routeController = express.Router();

routeController.get("/:imageId", routeService.getRoute);
routeController.post("/", routeService.createRoute);

export default routeController;
