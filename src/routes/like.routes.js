import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike, getVideoLikeStatus } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/toggle-Like-status/:videoId", toggleVideoLike);
router.get("/get-Video-Like-Status/:videoId", getVideoLikeStatus);

export default router;
