import * as routeRepository from "./route.repository.js";

export const getRoute = async (req, res) => {
  try {
    const { imageId } = req.params;
    const images = await routeRepository.getImagesByImageId(imageId);

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const urls = images.map((image) => image.url);

    res.status(200).json({ success: true, urls });
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createRoute = async (req, res) => {
  try {
    const { url, imageId } = req.body;

    // 이미지 생성
    const newImageId = await routeRepository.createImage(url, imageId);

    res.status(201).json({ success: true, imageId: newImageId });
  } catch (error) {
    console.error("Error creating image:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
