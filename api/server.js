const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");

const chatNsp = io.of("/chat");
const videoNsp = io.of("/video");

// Create object to hold active users:
const activeRooms = [];

// Test to see number of sockets in chat namespace
const socketCount = io.of("/chat").sockets.size;

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

app.get("/active", (req, res) => {
  res.status(200).json(activeRooms);
});

// io.on("connection", (socket) => {
//   socket.on("login", (userName) => {
//     console.log(userName);
//   });
// });

// app.get("/:room", (req, res) => {
//   res.send({ roomId: req.params.room, userId: 1 });
// });

chatNsp.on("connection", (socket) => {
  console.log("a user connected to the chat");
  socket.on("join", (roomID, userID) => {
    console.log(`${userID} connected to the chat in ${roomID}`);
    // console.log(socket.rooms);
    const activeUser = {};
    activeUser.username = userID;
    activeUser.room = roomID;
    activeRooms.push(activeUser);
  });
  socket.on("chat", (msg) => {
    io.broadcast(msg);
  });
});
console.log(activeRooms);
videoNsp.on("connection", (socket, stream) => {
  //console.log("Received a connection from the client");
  socket.on("video-chat", (message) => {
    // console.log(message);
  });
  // console.log("stream", stream);
  // socket.on("new-user", (foo) => {
  // socket.emit(foo)
  // })
  // console.log(socket);
});

module.exports = server;
