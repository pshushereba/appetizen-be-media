const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

// const videoRouter = require("../videos/video-router.js");
app.use(cors());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
//   next();
// });

app.get("/", (req, res) => {
  res.send("Hello");
  // const newRoomID = uuidV4();
  //   res.status(200).json(newRoomID);
  // res.redirect(`/${newRoomID}`);
});

// app.get("/:room", (req, res) => {
//   res.send({ roomId: req.params.room, userId: 1 });
// });

io.on("connection", (socket) => {
  socket.on("join-room", (messageFromClient) => {
    console.log(messageFromClient);
    //socket.join(roomId);
    //socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});

// app.use("/api/videos", videoRouter);

module.exports = server;
