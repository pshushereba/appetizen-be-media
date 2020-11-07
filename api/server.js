const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const videoRouter = require("../videos/video-router.js");

app.use(cors());
app.use("/api/videos", videoRouter);

module.exports = server;
