/*import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  caption: { type: String, default: "" },
  image: { type: String, required: "true" },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: "true",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});
export const Post = mongoose.model("Post", postSchema);

import mongoose from "mongoose";
import { User } from "./user.model.js";

const postSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);*/

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    image: { type: String, required: true }, // Fixed required value (boolean instead of string)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Changed to match standard User model reference
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        // Changed to lowercase for consistency
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
