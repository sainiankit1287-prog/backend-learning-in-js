import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  publishAvideo,
  getAllVideo,
  updateVideo,
  togglePublishSatuts,
} from "../controllers/video.controller.js";
import { strictFileCheck } from "../middlewares/fileType.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/publish-A-video").post(
  strictFileCheck,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAvideo
);
router.route("/update-video/:videoId").patch(
  strictFileCheck,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo
);
router.route("/toggle-publish-status/:videoId").patch(togglePublishSatuts);
router.route("/get-All-Video").get(getAllVideo);

export default router;
