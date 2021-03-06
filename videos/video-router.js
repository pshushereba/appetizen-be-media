const express = require("express");
const router = express.Router();
const server = require("http").Server(router);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

router.get("/", (req, res) => {
  const newRoomID = uuidV4();
  res.status(200).json(newRoomID);
  //res.redirect(`/${newRoomID}`);
});

router.get("/:room", (req, res) => {
  res.send({ roomId: req.params.room, userId: 1 });
});

io.on("connection", (socket) => {
  console.log(socket.roomId);
});

module.exports = router;
