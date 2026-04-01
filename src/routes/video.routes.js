import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    publishAvideo,
    getAllVideo

} from "../controllers/video.controller.js";


const router=Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file
router.route("/publish-A-video").post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },

            
        ]),
        publishAvideo
);
router.route("/get-All-Video").get(
    verifyJWT,
    getAllVideo
)



export default router;
