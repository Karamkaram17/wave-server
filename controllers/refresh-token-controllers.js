const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handelRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.UserInfo._id) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture,
          _id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3600s" }
    );

    res.status(200).json({ accessToken });
  });
};

module.exports = { handelRefreshToken };
