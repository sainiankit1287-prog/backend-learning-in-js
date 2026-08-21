import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import replaceOnCloudinary from "../utils/replaceOnCloudinary.js";

/**
 * controllers
1.getAllVideo
2.publishAvideo
3.updateVideo
4.getVideobypublicId
5.deleteAvideo
6.togglePublishSatuts
7.update title
8.update description
 */

const getAllVideo = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(30, Math.max(1, Number(limit) || 1));
  const skip = (pageNum - 1) * limitNum;
  const normalizedQuery = typeof query === "string" ? query.trim() : "";
  const normalizedSortType =
    typeof sortType === "string" ? sortType.toLowerCase() : "desc";

  //query to get videos
  const filter = {};

  // Search by title (case-insensitive)
  if (normalizedQuery) {
    /**$regex
        Provides regular expression capabilities for pattern matching strings in queries. */
    filter.title = { $regex: normalizedQuery, $options: "i" };
  }

  //filter by user id
  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid userId");
    }

    filter.owner = new mongoose.Types.ObjectId(userId);
  }

  //sorting
  const sort = {};
  const allowedSortFields = ["createdAt", "views", "duration", "title"];

  if (sortBy && allowedSortFields.includes(sortBy)) {
    sort[sortBy] = normalizedSortType === "asc" ? 1 : -1;
  } else {
    sort.createdAt = -1; // default
  }

  // const [videos, total] = await Promise.all([
  //     Video.find(filter)
  //         .sort(sort)
  //         .skip(skip)
  //         .limit(limitNum)
  //         .lean(), //faster response
  //     Video.countDocuments(filter)
  // ])

  // For better performance, use an aggregation pipeline.
  const [result = { videos: [], totalCount: [] }] = await Video.aggregate([
    { $match: filter },
    { $sort: sort },
    {
      $facet: {
        videos: [{ $skip: skip }, { $limit: limitNum }],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    },
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
        videos,
      },
      "Videos fetched successfully"
    )
  );
});
const publishAvideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const [videoFile, thumbnailFile] = await Promise.all([
    uploadOnCloudinary(videoLocalPath),
    uploadOnCloudinary(thumbnailLocalPath),
  ]);

  if (!videoFile?.secure_url || !thumbnailFile?.secure_url) {
    throw new ApiError(500, "Video or thumbnail upload failed");
  }

  const video = await Video.create({
    title: title.trim(),
    description: description.trim(),
    videoFile: videoFile.secure_url,
    thumbnail: thumbnailFile.secure_url,
    duration: Number(videoFile.duration) || 0,
    owner: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, video, "Video uploaded successfully"));
});

const togglePublishSatuts = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can update only your own video");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video publish status updated successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { videoId } = req.params;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(400, "Title and description are required");
  }

  const existingVideo = await Video.findById(videoId);

  if (!existingVideo) {
    throw new ApiError(404, "Video not found");
  }

  if (existingVideo.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can update only your own video");
  }

  let videoUrl = existingVideo.videoFile;
  let thumbnailUrl = existingVideo.thumbnail;

  if (videoLocalPath) {
    const updatedVideo = await replaceOnCloudinary(
      videoLocalPath,
      existingVideo.videoFile
    );

    if (!updatedVideo?.secure_url && !updatedVideo?.url) {
      throw new ApiError(500, "Video replacement failed");
    }

    videoUrl = updatedVideo.secure_url || updatedVideo.url;
  }

  if (thumbnailLocalPath) {
    const updatedThumbnail = await replaceOnCloudinary(
      thumbnailLocalPath,
      existingVideo.thumbnail
    );

    if (!updatedThumbnail?.secure_url && !updatedThumbnail?.url) {
      throw new ApiError(500, "Thumbnail replacement failed");
    }

    thumbnailUrl = updatedThumbnail.secure_url || updatedThumbnail.url;
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title.trim(),
        description: description.trim(),
        videoFile: videoUrl,
        thumbnail: thumbnailUrl,
      },
    },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const content = req.body?.content?.trim();

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }

  const video = await Video.findById(videoId).select("_id");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  const createdComment = await Comment.findById(comment._id).populate(
    "owner",
    "username fullName avatar"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdComment, "Comment added successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const pageNum = Math.max(1, Number(req.query.page) || 1);
  const limitNum = Math.min(30, Math.max(1, Number(req.query.limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) {
    throw new ApiError(404, "Video not found");
  }

  const [comments, total] = await Promise.all([
    Comment.find({ video: videoId })
      .populate("owner", "username fullName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Comment.countDocuments({ video: videoId }),
  ]);

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
        comments,
      },
      "Comments fetched successfully"
    )
  );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const content = req.body?.content?.trim();

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can update only your own comment");
  }

  comment.content = content;
  await comment.save();
  await comment.populate("owner", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can delete only your own comment");
  }

  await comment.deleteOne();

  return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export {
  getAllVideo,
  publishAvideo,
  updateVideo,
  togglePublishSatuts,
  addComment,
  getVideoComments,
  updateComment,
  deleteComment,
};
