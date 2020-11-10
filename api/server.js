const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");

const testNamespace = io.of("/testing");

// const videoRouter = require("../videos/video-router.js");
// {
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Origin": "http://localhost:3000", //or the specific origin you want to give access to,
//     };
//     res.writeHead(200, headers);
//     res.end();
//   },
// }
//app.use(cors());
//io.origins = ["http://localhost:3000"];
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
// res.header("Access-Control-Allow-Headers", "X-Requested-With");
// res.header("Access-Control-Allow-Headers", "Content-Type");
// res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
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

testNamespace.on("connection", (socket) => {
  console.log("a user connected");
});

// app.use("/api/videos", videoRouter);

module.exports = server;
