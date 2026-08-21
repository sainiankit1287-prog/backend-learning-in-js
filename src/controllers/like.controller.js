import { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

//togglevideolike
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  // Unlike
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    const likes = await Like.countDocuments({
      video: videoId,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          liked: false,
          likes,
        },
        "Video unliked successfully"
      )
    );
  }

  // Like
  await Like.create({
    video: videoId,
    likedBy: userId,
  });

  const likes = await Like.countDocuments({
    video: videoId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        liked: true,
        likes,
      },
      "Video liked successfully"
    )
  );
});

//getvideolikestatus
const getVideoLikeStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const likes = await Like.countDocuments({ video: videoId });

  const userLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        liked: !!userLike,
        likes,
      },
      "Video like status retrieved successfully"
    )
  );
});

export { toggleVideoLike, getVideoLikeStatus };
