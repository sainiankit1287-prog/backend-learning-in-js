import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user?._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId.toString() === subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    throw new ApiError(409, "You are already subscribed to this channel");
  }

  const subscription = await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, subscription, "Subscribed to channel successfully"));
});

//unsubscripe from channel
const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user?._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const deletedSubscription = await Subscription.findOneAndDelete({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (!deletedSubscription) {
    throw new ApiError(404, "Subscription not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedSubscription, "Unsubscribed from channel successfully")
    );
});

//get all subscribers of channel

const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberDetails",
      },
    },
    {
      $unwind: "$subscriberDetails",
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        subscriber: "$subscriberDetails",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Channel subscribers retrieved successfully")
    );
});

//getSubscribedChannels
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $unwind: "$channelDetails",
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        channel: "$channelDetails",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels retrieved successfully"
      )
    );
});
//getSubscriptionStatus
const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user?._id;

  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (!subscriberId) {
    throw new ApiError(400, "Subscriber ID is required");
  }

  const subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isSubscribed: !!subscription,
      },
      "Subscription status fetched successfully"
    )
  );
});

//getSubscriptionStats

const getSubscriptionStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const stats = await Subscription.aggregate([
    {
      $facet: {
        subscribersCount: [
          {
            $match: {
              channel: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $count: "count",
          },
        ],
        subscribedToCount: [
          {
            $match: {
              subscriber: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const subscribersCount = stats[0]?.subscribersCount[0]?.count || 0;
  const subscribedToCount = stats[0]?.subscribedToCount[0]?.count || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribersCount,
        subscribedToCount,
      },
      "Subscription stats fetched successfully"
    )
  );
});
export {
  subscribeToChannel,
  unsubscribeFromChannel,
  getChannelSubscribers,
  getSubscribedChannels,
  getSubscriptionStatus,
  getSubscriptionStats,
};
