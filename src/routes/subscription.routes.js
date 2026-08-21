import { Router } from "express";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
  getChannelSubscribers,
  getSubscribedChannels,
  getSubscriptionStatus,
  getSubscriptionStats,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/subscribe/:channelId").post(verifyJWT, subscribeToChannel);
router.route("/unsubscribe/:channelId").delete(verifyJWT, unsubscribeFromChannel);

router.route("/channel-subscribers/:channelId").get(verifyJWT, getChannelSubscribers);
router.route("/user-subscriptions/:userId").get(verifyJWT, getSubscribedChannels);
router.route("/status/:channelId").get(verifyJWT, getSubscriptionStatus);
router.route("/stats/:userId").get(verifyJWT, getSubscriptionStats);

export default router;
