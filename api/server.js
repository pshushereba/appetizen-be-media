const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");

const chatNsp = io.of("/chat");
const videoNsp = io.of("/video");

// Create array to hold active users:
const activeRooms = [];

// Create Object to hold chat history for open rooms:
const socketHistory = {};

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
  let socketRoom;
  socket.on("join", (roomID, userID) => {
    console.log(`${userID} connected to the chat in ${roomID}`);

    // Create Object to hold info about acive user (streamer)
    const activeUser = {};
    activeUser.streamId = userID;
    activeUser.room = roomID;
    activeRooms.push(activeUser);

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

  // socket.on("chat", (msg, room) => {
  //   io.broadcast(msg);

  // socketHistory[socketRoom] = socketHistory[socketRoom] ?
  //   [data.message, ...socketHistory[socketRoom]] : [data.message]
  // });
});

videoNsp.on("connection", (socket) => {
  socket.on("join", (roomID, username) => {
    socket.join(roomID);
    console.log(`${username} has joined video in ${roomID}`);
    socket.broadcast.to(roomID).emit(`${username} has joined ${roomID}`);
  });

  socket.on("viewer-connected", (data) => {
    socket.broadcast.to(roomID).emit("viewer-connected");
  });
});

module.exports = server;
