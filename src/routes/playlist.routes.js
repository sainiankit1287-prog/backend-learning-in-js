import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getMyPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/create-Playlist", createPlaylist);
router.get("/get-My-Playlists", getMyPlaylists);

router.get("/get-Playlist-ById/:playlistId", getPlaylistById);
router.patch("/update-Playlist/:playlistId", updatePlaylist);
router.delete("/delete-Playlist/:playlistId", deletePlaylist);

router.post("/add-Video/:playlistId/videos/:videoId", addVideoToPlaylist);
router.delete("/remove-Video/:playlistId/videos/:videoId", removeVideoFromPlaylist);

export default router;
