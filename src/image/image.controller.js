import express from "express";
import { upload } from "./image.service.js";

const imageController = express.Router();

imageController.post("/", upload.single("img"), async (req, res) => {
  res.json({ url: req.file.location });
});

export default imageController;
