import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlists.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//create playlist

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Playlist name and description are required");
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    description: description.trim(),
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getMyPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id })
    .populate("videos", "title videoFile duration")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

//getplaylistbyid

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate("owner", "username fullName avatar")
    .populate("videos", "title videoFile thumbnail duration");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

//updatePlaylist

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Playlist name and description are required");
  }

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $set: {
        name: name.trim(),
        description: description.trim(),
      },
    },
    { new: true }
  );
  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

//delete playlist

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }

  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

//add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlistId or videoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $addToSet: {
        videos: videoId,
      },
    },
    { new: true }
  ).populate("videos", "title videoFile thumbnail duration");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized");
  }

  return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"));
});

//remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlistId or videoId");
  }

  const playlist = await Playlist.findOneAndUpdate(
    {
      _id: playlistId,
      owner: req.user._id,
    },
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  ).populate("videos", "title videoFile thumbnail duration");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found or unauthorized");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});
export {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
