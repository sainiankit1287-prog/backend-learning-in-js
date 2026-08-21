import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//configration of cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // json data accept kargi
//url data confiration extended provide nested objects
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// static
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
//routes declaration
app.use("/users", userRouter); // over direct users we use versioning in api like /api/v1/users
app.use("/videos", videoRouter);
app.use("/tweets", tweetRouter);
app.use("/comments", commentRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/likes", likeRouter);
app.use("/playlists", playlistRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

app.use(errorHandler);

// work flow of this on url==> /users->userRouter->./routes/user.routes.js->/register->post() method send to ->../controllers/user.controller.js->then asyncHandler() function call and control go to ->../utils/asyncHandler.js
// how url create
// http://localhost:8000/api/v1/users/register
// http://localhost:8000/users/register
export { app };
