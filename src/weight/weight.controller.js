import express from "express";
import * as weightService from "./weight.service.js";

const weightController = express.Router();

weightController.post("/", weightService.createWeight);
weightController.get("/:userId", weightService.getWeight);
weightController.put("/:weightId", weightService.updateWeight);
weightController.delete("/:weightId", weightService.deleteWeight);

export default weightController;
