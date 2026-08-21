import { Router } from "express";
import {
  addComment,
  getVideoComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-Comment/:videoId").post(verifyJWT, addComment);
router.route("/update-Comment/:commentId").put(verifyJWT, updateComment);
router.route("/get-Video-Comments/:videoId").get(getVideoComments);
router.route("/delete-Comment/:commentId").delete(verifyJWT, deleteComment);

export default router;
