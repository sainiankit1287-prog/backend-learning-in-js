import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })


        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    // validation - not empty
    // check if user already exists:username, email
    //check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object -create entry in db
    //remove password and refresh token field from response
    // check for user creation
    // return response



    const { fullName, email, username, password } = req.body
    console.log("email:", email);
    // begginer friendly  
    // if(fullName===""){
    //     throw new ApiError(400,"fullname is required")
    // }

    // for check all things we array inside in if condition
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All the fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }] // retturn first occurence
    })
    if (existedUser) {
        throw new ApiError(409, "user with email or username already exists")
    }
    //file handling and try console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //if user not send cover image then
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is required")
    }
    // upload on Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "avatar file is required");
    }
    // user create on mongo db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",// coverImage h to url pass kar do warna khali rahne do
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) // _id created by mongo db , inside select (-) show ye wali field nhi chahiye

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")

    }

    //response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User regsister successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    /*
    1. req body->data
    2. username or email
    3.find the user
    4. password check
    5.accees and refresh token generate and send to user
    6. send cookies  

    */
    // data fetch from req.body
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }] // mongo db syntax
    })
    if (!user) {
        throw new ApiError(404, "user does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid  user credentials");
    }

    //here accessToken and refreshToken are varible
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // now to update user you run data base query if no cost or update normally
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // sending cookies 
    const options = {
        httpOnly: true,
        secure: false // becuase i checked on locahost
    }// these are update only by  server

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, accessToken, // with help this user can store these token locally in there system but this not good practics in  web development
                refreshToken
            },
                "User logged In Successfully"
            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {
    //due to varifyJWT middleware we access of user
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined //$set is mongo db method
            }

        },
        {
            returnDocument: "after" // this provide updated value
        }
    )
    const options = {
        httpOnly: true,
        secure: false, // for locahost
        //sameSite: "lax"
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiError(200, {}, "user logged out"))

})

/**
User logs into the application
Server generates and sends:
    Access Token (short-lived)
    Refresh Token (long-lived)
Frontend stores:
    Access Token (memory/local storage)
    Refresh Token (secure HTTP-only cookie preferred)
    User makes an API request using the Access Token
System checks:
    If Access Token is valid → request succeeds
    If Access Token is expired → server returns 401 Unauthorized
On receiving 401 error:
    Frontend automatically calls /refresh-token API
    Sends Refresh Token along with the request
    Backend verifies Refresh Token:
If valid:
    Generates new Access Token (and optionally new Refresh Token)
    Sends it back to frontend
If invalid/expired:
    Rejects request
    Frontend handles response:
    If new Access Token received:
    Store updated Access Token
    Retry the original API request
If refresh fails:
    ct user to login page
Result:
    Smooth user experience (no frequent logouts)
    Secure session management maintained
 */

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.
        refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        // always try to send error in Apierror inseted of Api response because it helps in debuging avoid fake reponse of status of 200
        throw new ApiError(401, "unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET

            /**
             REFRESH_TOKEN_SECRET = your private signature key
            Refresh Token = a signed document
            jwt.verify() = checking if the signature is real
             */
        )
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            // always try to send error in Apierror inseted of Api response because it helps in debuging avoid fake reponse of status of 200
            throw new ApiError(401, "unauthorized request");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body

    const user = await User.findById(user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }
    user.password = newpassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "password is change successfully")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"))

    // because user already injected 
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!(fullName && email)) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { returnDocument: "after" }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})

// make separate endpoints for upload the files

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path // file use for only one file 
    console.log(avatarLocalPath)
    console.log("FILE:", req.file);
console.log("BODY:", req.body);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const existedUser = await User.findById(req.user?._id);

    if (existedUser?.avatar) {
        await deleteFromCloudinary(existedUser.avatar);
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(500, "Error while uploading on avatar")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url // because initially we are take string from cloudinary
            }
        },
        { returnDocument: "after" }
    ).select("-password")
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "avatar update successfully ")
        )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path // file use for only one file 

    if (!coverImageLocalPath) {
        throw new ApiError(400, "coverImage file is missing")
    }
    const existedUser = await findById(req.user?._id);

    if (existedUser?.coverImage) {
        await deleteFromCloudinary(existedUser.coverImage);
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(500, "Error while uploading on coverImage")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url // because initially we are take string from cloudinary
            }
        },
        { returnDocument: "after" }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "cover image update successfully ")
        )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage

}