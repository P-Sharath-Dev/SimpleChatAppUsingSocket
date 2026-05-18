import express from "express";
import { Server } from "socket.io";
import http from "http";

//creating http server
const app = express();
const server = http.createServer(app);

//creating socket server
const io = new Server(server, {
  //handling cross origin resource sharing
  //using cors coz i am server is not giving client . we created in seperate file(client.html)
  cors: {
    // origin: "http://localhost:3000",  // this line is not working. only origin : "*" is working
    origin: "*",
    methods: ["GET, POST"],
  },
});

//establishing connection
io.on("connection", (socket) => {
  // console.log("connection is established");

  //disconnect
  socket.on("disconnect", () => {
    // console.log("disconnetcted");
  });

  //handle new user
  socket.on("new_user", (username) => {
    // console.log("new user : ", username, socket.id);
  });

  //hanlde on event
  socket.on("new_msg", (msg) => {
    // console.log("new message : ", msg);

    //brodcast this message to all clients. this message is sent to all clients except for the sender
    socket.broadcast.emit("broadcast_msg", msg);
  });
});

server.listen(3000, () => {
  console.log("server is running on port : 3000");
});
