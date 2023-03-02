const express = require("express");
const router = express.Router();

const {
  handelRefreshToken,
} = require("../controllers/refresh-token-controllers");

router.route("/").get(handelRefreshToken);

module.exports = router;
