import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    duration: {
      type: Number,
      required: true,
      min: 0,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

videoSchema.index({ owner: 1, createdAt: -1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ title: "text", description: "text" });

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);