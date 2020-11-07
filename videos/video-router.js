const express = require("express");
const router = express.Router();
const server = require("http").Server(router);
const io = require("socket.io")(server);

router.get("/", (req, res) => {
  //
});

router.get("/:room", (req, res) => {
  res.send({ roomId: req.params.room });
});

module.exports = router;
