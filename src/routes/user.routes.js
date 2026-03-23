import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",// frontend mai bhi same hona chahiye taki comunication achha ho
            maxCount:1// define how many file you accept
        },
        {
            name:"coverImage",
            maxCount:1
        }// this called middleware inject  it use for file handling
    ]),
    registerUser
)//post is methode


export default router;