const express = require("express");
const router = express.Router();

const {
  handleLogin,
  HandleRegistration,
} = require("../controllers/auth-controllers");

router.route("/login").post(handleLogin);
router.route("/register").post(HandleRegistration);
module.exports = router;
