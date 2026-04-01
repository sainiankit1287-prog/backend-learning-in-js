import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/**
 * controllers
1.getAllVideo
2.publishAvideo
3.updateVideo
4.getVideobypublicId
5.deleteAvideo
6.togglePublishSatuts
 */

const getAllVideo = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    const pageNum = Math.max(1, Number(page) || 1)
    const limitNum = Math.min(30, Math.max(1, Number(limit) || 1))
    const skip = (pageNum - 1) * limitNum;
    const normalizedQuery = typeof query === "string" ? query.trim() : "";
    const normalizedSortType = typeof sortType === "string" ? sortType.toLowerCase() : "desc";

    //query to get videos
    const filter = {};

    // Search by title (case-insensitive)
    if (normalizedQuery) {
        /**$regex
        Provides regular expression capabilities for pattern matching strings in queries. */
        filter.title = { $regex: normalizedQuery, $options: "i" }
    }

    //filter by user id
    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, "Invalid userId");
        }

        filter.owner = new mongoose.Types.ObjectId(userId)
    }

    //sorting
    const sort = {};
    const allowedSortFields = ["createdAt", "views", "duration", "title"];

    if (sortBy && allowedSortFields.includes(sortBy)) {
        sort[sortBy] = normalizedSortType === "asc" ? 1 : -1;
    } else {
        sort.createdAt = -1;// default
    }

    // const [videos, total] = await Promise.all([
    //     Video.find(filter)
    //         .sort(sort)
    //         .skip(skip)
    //         .limit(limitNum)
    //         .lean(), //faster response
    //     Video.countDocuments(filter)
    // ])

    //for bettrer perfromance we use aggreation pipeline
    const [result = { videos: [], totalCount: [] }] = await Video.aggregate([
        { $match: filter },
        { $sort: sort },
        {
            $facet: {
                videos: [
                    { $skip: skip },
                    { $limit: limitNum }
                ],
                totalCount: [
                    {
                        $count: "count"
                    }
                ]
            }
        }
    ]);
    const videos = result.videos || [];
    const total = result.totalCount[0]?.count || 0;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum * limitNum < total,
                hasPrevPage: pageNum > 1,
                videos
            },
            "Videos fetched successfully"
        )
    );
})
const publishAvideo = asyncHandler(async (req, res) => {
    //title of video 
    // description of video/ topic
    const { title, description } = req.body;
const user = await User.findById(req.user._id);
console.log(user);


    if (
        [title, description].some(field => (field || "").trim() === "")
    ) {
        throw new ApiError(400, "Both title & description the fields are required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "video is requried to upload");
    }

    let videoFile;
    try {
        videoFile = await uploadOnCloudinary(videoLocalPath);
    } catch (error) {
        console.log("124 video controller", error.message)
        throw new ApiError(500, "Cloudinary service error");
    }
    console.log(videoFile)
    if (!videoFile) {
        throw new ApiError(500, "Video upload failed");
    }
    console.log(videoFile.secure_url || videoFile.url,)
   

    const video = await Video.create({
        title: title.trim(),
        description: description.trim(),
        videoFile: videoFile.secure_url || videoFile.url,
        duration: Number(videoFile.duration) || 0,
        owner: req.user._id
    });

    if (!video) {
        throw new ApiError(500, "Internal server issue while saving in database: " + error.message);
    }

    return res
        .status(201)// 201 use to upload any thing
        .json(
            new ApiResponse(200, { video: video.videoFile }, "video uploaded sucessfully")
        )


})


export {
    getAllVideo,
    publishAvideo
}
