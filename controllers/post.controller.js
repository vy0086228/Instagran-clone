import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    // Check if the image is provided
    if (!image) return res.status(400).json({ message: "Image is required" });

    // Image optimization using sharp
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Convert optimized image to base64 and upload to Cloudinary
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    // Create a new post with the image URL from Cloudinary
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url, // Use `secure_url` instead of `secure_uri`
      author: authorId,
    });

    // Add the post to the user's list of posts
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    // Populate author information, excluding the password
    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while adding the post",
      success: false,
      error: error.message,
    });
  }
};
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        strictPopulate: false,
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({ posts, success: true });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        paht: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(400)
        .json({ message: "Post not found", success: false });
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};
export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(400)
        .json({ message: "Post not found", success: false });
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
    await post.save();

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;

    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text)
      return res
        .status(400)
        .json({ message: "text is required", success: false });
    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
    }).populate({
      path: "author",
      select: "username, profilePicture",
    });
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment is Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username",
      "profilePicture"
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments fount for this post", success: false });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.log(error);
  }
};
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(postId);

    let user = await user.findById(authorId);
    user.posts = User.posts.filter((id) => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "Post is deleted",
    });
  } catch (error) {
    console.log(error);
  }
};
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await user.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Post bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
