import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImages, getImages } from "../controllers/images.controller.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/upload")
  .post(
    upload.fields([{ name: "images", maxCount: 3 }]),
    verifyJWT,
    uploadImages
  );

router.route("/images").get(verifyJWT, getImages);

export default router;
