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
  // const activeUser = {};
  // activeUser.streamId = userID;
  // activeUser.room = roomID;
  // activeRooms.push(activeUser);
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
  let socketRoom;
  socket.on("join", (roomID, userID) => {
    console.log(`${userID} connected to the chat in ${roomID}`);

    // Create Object to hold info about acive user (streamer)
    // const activeUser = {};
    // activeUser.streamId = userID;
    // activeUser.room = roomID;
    // activeRooms.push(activeUser);

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
  //let streamerID;
  socket.on("join", (roomID, username, peerId) => {
    // Create Object to hold info about acive user (streamer)
    // const activeUser = {};
    // activeUser.streamId = username;
    // activeUser.room = roomID;
    // activeUser.peerId = peerId;
    // activeRooms.push(activeUser);
    socket.join(roomID);
    // streamerID = peerID;
    console.log(`${username} has joined video in ${roomID}`);
    //socket.broadcast.to(roomID).emit(`${username} has joined ${roomID}`);
  });

  socket.on("streaming", (peerId, roomID, username) => {
    // Create Object to hold info about acive user (streamer)
    console.log("in streaming", peerId, roomID, username);
    // const activeUser = {};
    // activeUser.streamId = username;
    // activeUser.room = roomID;
    // activeUser.peerId = peerId;
    // activeRooms.push(activeUser);
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
