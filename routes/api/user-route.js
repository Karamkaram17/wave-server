const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleWare/verify-jwt");
const verifyUser = require("../../middleWare/verify-user");

const {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  addOrRemoveFriendship,
} = require("../../controllers/user-controllers");

router.route("/").get(verifyJWT, getAllUsers);
router
  .route("/:id")
  .get(verifyJWT, getOneUser)
  .patch(verifyJWT, verifyUser, updateUser)
  .delete(verifyJWT, verifyUser, deleteUser);
router
  .route("/:id/friend/:friendId")
  .patch(verifyJWT, verifyUser, addOrRemoveFriendship);

module.exports = router;
