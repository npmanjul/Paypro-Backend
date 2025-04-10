import { Router } from "express";
import {
  checkPhoneNumber,
  getProfile,
  updatePhoneNumber,
  updateProfile,
} from "../controller/profile.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.route("/getprofile/:userId").get(authMiddleware, getProfile);
router
  .route("/updateprofile/:userId")
  .patch(authMiddleware, upload.single("image"), updateProfile);
router.route("/checkphone/:userId").get(checkPhoneNumber);
router.route("/updatephone/:userId").patch(updatePhoneNumber);

export default router;
