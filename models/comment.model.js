import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
});

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
