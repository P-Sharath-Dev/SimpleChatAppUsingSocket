import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: Date,
});

const MessageModel = new mongoose.model("Message", messageSchema);

export default MessageModel;
