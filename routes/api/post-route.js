const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleWare/verify-jwt");
const verifyUser = require("../../middleWare/verify-user");

const {
  getAllUserPosts,
  createPost,
  updatePost,
  deletePost,
  likeOrDislike,
  comment,
  deleteComment,
  getPostsForUserAndFriends,
} = require("../../controllers/posts-controllers");

router
  .route("/my-posts/:id")
  .get(verifyJWT, getAllUserPosts)
  .post(verifyJWT, verifyUser, createPost);

router
  .route("/my-friends-posts/:id")
  .get(verifyJWT, verifyUser, getPostsForUserAndFriends);

router
  .route("/:id/post/:postId")
  .patch(verifyJWT, verifyUser, updatePost)
  .delete(verifyJWT, verifyUser, deletePost);

router.route("/:id/like/:postId").patch(verifyJWT, verifyUser, likeOrDislike);

router.route("/:id/comment/:postId").patch(verifyJWT, verifyUser, comment);

router
  .route("/:id/post/:postId/delete-comment/:commentId")
  .patch(verifyJWT, verifyUser, deleteComment);

module.exports = router;
