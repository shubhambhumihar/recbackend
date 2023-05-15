const { isAdmin } = require("../middlewares/auth");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

exports.createNewPost = asyncHandler(async (req, res) => {
  try {
    // const { title, desc } = req.body;

    const newPost = await Post.create(req.body);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rechms1234@gmail.com", // replace with your email address
        pass: "tgcgjdvkeexnmcvp", // replace with your email password or app password
      },
    });

    const mailOptions = {
      from: "rechms1234@gmail.com", // replace with your email address
      to: "kumarijyotichouhan@gmail.com", // replace with the admin's email address
      subject: "Post Created!",
      html: `
        <p>User ID: ${newPost.userId}</p>
        <p>Description: ${newPost.desc}</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent successfully: " + info.response);
      }
    });
    res.status(201).json({ success: true, newPost });
  } catch (error) {
    throw new Error(error.message);
  }
});

// Get all posts
exports.getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", ["name"])
      .sort({ createdAt: -1 }); // populate the 'user' field with 'name' and 'avatar'
    res.status(200).json({ success: true, posts });
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.updatePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        msg: "User not authorized! You cant update someone's else post",
      });
    }

    await post.updateOne({ $set: req.body });
    res.status(200).json("Post updated successfully");
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.user);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (
      req.user.role !== "admin" &&
      post.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        msg: "User not authorized! You cant delete someone's else post",
      });
    }

    await post.deleteOne();
    res.status(200).json("Post deleted successfully");
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.getSinglePostById = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", [
      "name",
    ]);
    //   .populate("comments.user", ["name", "avatar"]); // populate the 'user' field with 'name' and 'avatar', and the 'comments.user' field with 'name' and 'avatar'
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    throw new Error(error.message);
  }
});
exports.likePost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (
      !post.likes.some(
        (like) => like.user.toString() === req.user._id.toString()
      )
    ) {
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.status(200).json("Post Liked successfully!");
    } else {
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
      await post.save();
      res.status(200).json("Post DisLiked successfully!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.addCommentToPost = asyncHandler(async (req, res) => {
  try {
    // find post first
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id).select("-password"); //find user then
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const newComment = {
      commentText: req.body.commentText,
      name: user.name,
      user: req.user._id,
    };
    post.comments.unshift(newComment);
    await post.save();
    res.status(201).json({ msg: "Comment added successfully" });
  } catch (err) {
    throw new Error(err.message);
  }
});
exports.deleteCommentOnPost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    if (comment.user.toString() !== req.user.id.toString()) {
      return res
        .status(401)
        .json({ msg: "User not authorized! You can't delete this comment" });
    }
    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );
    await post.save();
    res.status(200).json("comment deleted successfully!");
  } catch (err) {
    throw new Error(err.message);
  }
});
exports.getComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (err) {
    throw new Error(err.message);
  }
});
