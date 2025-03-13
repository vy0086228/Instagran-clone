import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receverId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});
export const Message = mongoose.model("Message", messageSchema);
