const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");
const bodyParser = require("body-parser");

const chatNsp = io.of("/chat");
const videoNsp = io.of("/video");

// Create array to hold active users:
const activeRooms = [];
console.log(activeRooms);
// Create Object to hold chat history for open rooms:
const socketHistory = {};

// Test to see number of sockets in chat namespace
const socketCount = io.of("/chat").sockets.size;

app.use(cors());
app.use(bodyParser.json());

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

app.post("/live", (req, res) => {
  const streamer = req.body;
  console.log(streamer);
  const activeUser = {};
  activeUser.streamId = streamer.user;
  activeUser.room = streamer.room;
  activeUser.peerId = streamer.peerID;
  activeRooms.push(activeUser);
  res.status(201).json(activeRooms);
});

chatNsp.on("connection", (socket) => {
  let socketRoom;
  socket.on("join", (roomID, userID) => {
    console.log(`${userID} connected to the chat in ${roomID}`);

    socket.join(roomID);
    socketRoom = roomID;
    socket.emit("joinResponse", socketHistory[socketRoom]);
  });

  socket.on("chat", (data) => {
    console.log(data.message);
    socket.broadcast.to(socketRoom).emit("chat", data.message);
    socketHistory[socketRoom] = socketHistory[socketRoom]
      ? [data.message, ...socketHistory[socketRoom]]
      : [data.message];
    console.log("socketHistory", socketHistory);
  });
});

videoNsp.on("connection", (socket) => {
  socket.on("join", (roomID, username, peerId) => {
    socket.join(roomID);
    console.log(`${username} has joined video in ${roomID}`);
    //socket.broadcast.to(roomID).emit(`${username} has joined ${roomID}`);
  });

  socket.on("viewer-connected", (roomID, username, viewerPeerId) => {
    console.log("room/username", roomID, username);
    socket.broadcast
      .to(roomID)
      .emit("viewer-connected", roomID, username, viewerPeerId);
  });

  socket.on("send-stream", (stream) => {
    console.log("send stream accessed.", stream);
    socket.emit(stream);
  });
});

module.exports = server;
