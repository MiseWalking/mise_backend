import mongoose from "mongoose";
import { useVirtualId } from "../db/database.js";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  imageId: { type: String, required: true },
});

useVirtualId(imageSchema);
const Image = mongoose.model("Image", imageSchema);

export async function createImage(url, imageId) {
  const newImage = new Image({ url, imageId });
  await newImage.save();
  return newImage.id;
}

export async function getImagesByImageId(imageId) {
  return Image.find({ imageId }).exec();
}

export async function deleteImage(imageId) {
  return Image.findByIdAndDelete(imageId).exec();
}
