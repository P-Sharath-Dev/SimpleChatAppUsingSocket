import express from "express";
import { Server } from "socket.io";
import http from "http";
import { connectToDB } from "./db.config.js";
import MessageModel from "./message.schema.js";
import { timeStamp } from "console";

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
  console.log("connection is established");

  //disconnect
  socket.on("disconnect", () => {
    console.log("disconnetcted");
  });

  //handle new user
  socket.on("new_user", async (username) => {
    // console.log("new user : ", username, socket.id);
    socket.username = username;

    try {
      //fetch old messages when new user joins
      const oldMessages = await MessageModel.find({});

      //send old messages to the new client
      socket.emit("old_messages", oldMessages);
    } catch (error) {
      console.log("error fetching old message : ", error);
    }
  });

  //hanlde on event (receiving new message)
  socket.on("new_msg", async (msg) => {
    console.log("new message : ", msg);
    const userMsg = {
      username: socket.username,
      msg,
    };

    try {
      //saving message to the db
      const newMessage = new MessageModel({
        username: socket.username,
        message: msg,
        timestamp: new Date(),
      });

      await newMessage.save();
    } catch (error) {
      console.log("error saving the messages : ", error);
    }

    //brodcast this message to all clients. this message is sent to all clients except for the sender
    socket.broadcast.emit("broadcast_msg", userMsg);
  });
});

server.listen(3000, () => {
  console.log("server is running on port : 3000");
  connectToDB();
});
