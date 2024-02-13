import ApiError from "../utils/API_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Api_Response } from "../utils/API_Response.js";

const uploadImages = asyncHandler(async (req, res) => {
  const uploadFiles = req.files["images"];

  if (!uploadFiles) {
    res.status(400).send("No files uploaded");
    return;
  }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const uploadedImageURLs = [];
    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];

      const uploadedImage = await uploadOnCloudinary(file.path);
      uploadedImageURLs.push(uploadedImage.url);
    }

    user.images = [...user.images, ...uploadedImageURLs];

    await user.save();

    res
      .status(200)
      .json({ message: "Images uploaded and user updated successfully" });
  } catch (error) {
    console.error("Error uploading files:", error);
    res
      .status(error.status || 500)
      .send(error.message || "Internal Server Error");
  }
});


const getImages = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({ images: user.images });
  } catch (error) {
    console.error("Error getting images:", error);
    res
      .status(error.status || 500)
      .json(new Api_Response(500, "Internal Server Error"));
  }
});

export { uploadImages, getImages };
