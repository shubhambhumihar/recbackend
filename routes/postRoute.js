const express = require("express");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const {
  createNewPost,
  getAllPosts,
  getSinglePostById,
  updatePost,
  deletePost,
  likePost,
  addCommentToPost,
  deleteCommentOnPost,
  getComment,
} = require("../controllers/postCntrlr");

const router = express.Router();

router.route("/").post(isAuthenticated, createNewPost);
router.route("/").get(getAllPosts);
router.route("/:id").get(getSinglePostById);
router.route("/:id").put(isAuthenticated, updatePost);
router.route("/:id").delete(isAuthenticated, deletePost);
router.route("/:id/like").put(isAuthenticated, likePost);
router.route("/:id/comment").put(isAuthenticated, addCommentToPost);
router
  .route("/:id/comment/:comment_id")
  .delete(isAuthenticated, deleteCommentOnPost);
router.route("/:id/comment/:comment_id").get(isAuthenticated, getComment);

// router.route("/:id/comment").put(isAuthenticated, addCommentToPost);

module.exports = router;
