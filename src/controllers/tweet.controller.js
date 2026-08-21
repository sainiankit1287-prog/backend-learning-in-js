import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweets.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({
    content: content.trim(),
    owner: req.user?._id,
  });

  return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(30, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [result = { tweets: [], totalCount: [] }] = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $facet: {
        tweets: [{ $skip: skip }, { $limit: limitNum }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

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
        tweets: result.tweets || [],
      },
      "Tweets fetched successfully"
    )
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  if (!content?.trim()) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You can update only your own tweet");
  }

  tweet.content = content.trim();
  await tweet.save();

  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner?.toString() !== req.user?._id?.toString()) {
    throw new ApiError(403, "You can delete only your own tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
