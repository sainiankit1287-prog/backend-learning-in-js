import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//add comment
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const content = req.body?.content?.trim();

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!content) {
    throw new ApiError(400, "Comment content is required");
  }

  const video = await Video.findById(videoId);

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
    "username email avatar fullName"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdComment, "Comment added successfully"));
});

//get comments on video
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.exists({ _id: videoId });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const [comments, total] = await Promise.all([
    Comment.find({ video: videoId })
      .populate("owner", "username email avatar fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Comment.countDocuments({ video: videoId }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        comments,
      },
      "Comments fetched successfully"
    )
  );
});

//update comment
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
    throw new ApiError(403, "You are not the owner of this comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  ).populate("owner", "username email avatar fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

//delete comment
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
    throw new ApiError(403, "You are not the owner of this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});
export { addComment, getVideoComments, updateComment, deleteComment };
