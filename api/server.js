const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");

const chatNsp = io.of("/chat");
const videoNsp = io.of("/video");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
  // const newRoomID = uuidV4();
  //   res.status(200).json(newRoomID);
  // res.redirect(`/${newRoomID}`);
});

app.get("/new", (req, res) => {
  const newRoomID = uuidV4();
  res.status(201).json(newRoomID);
});

// app.get("/:room", (req, res) => {
//   res.send({ roomId: req.params.room, userId: 1 });
// });

chatNsp.on("connection", (socket) => {
  console.log("a user connected to the chat");
});

videoNsp.on("connection", (socket) => {
  console.log("a user connected to the video");
});

// app.use("/api/videos", videoRouter);

module.exports = server;
