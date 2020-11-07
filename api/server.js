const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "*" });

const videoRouter = require("../videos/video-router.js");

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

app.use("/api/videos", videoRouter);

module.exports = server;
