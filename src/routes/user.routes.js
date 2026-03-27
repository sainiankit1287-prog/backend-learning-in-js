import { Router } from "express";
import { loginUser,
         logoutUser,
         refreshAccessToken,
         registerUser, 
         updateUserAvatar, 
         updateUserCoverImage, 
         changeCurrentPassword,
         getCurrentUser,
         updateAccountDetails, 
         getUserChannelProfile,
         getWatchHistory
        
        } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


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

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT,logoutUser)// here we insert more then one middleware jsut write there name after varifyJWT
router.route("/refresh-token").post(refreshAccessToken)

// to access localpath=req.files?.avatar[0].path
// router.route("/update-User-Avatar").post(
//     upload.fields([
//         {
//             name:"avatar",
//             maxCount:1
//         }
//     ])
//     ,updateUserAvatar)





//update the password changeCurrentPassword
router.route("/change-Current-password").post(verifyJWT, changeCurrentPassword);
router.route("/get-user").get(verifyJWT,getCurrentUser);
router.route("/update-details").patch(verifyJWT,updateAccountDetails)


// this is use for single upload file and we access the localpath=req.file?.path

router.route("/update-User-Avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)
//update coverImage 
router.route("/update-User-coverImage").patch(
        verifyJWT,
        upload.single("coverImage"),
        updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)    
router.route("/history").get(verifyJWT,getWatchHistory)    
export default router;