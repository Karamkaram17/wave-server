const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  const secret_key = process.env.REFRESH_TOKEN_SECRET;
  const _id = req.params.id;

  try {
    const decoded = jwt.verify(refreshToken, secret_key);
    if (decoded.UserInfo._id !== _id) {
      return res.status(403).send(`not authorized`);
    }
    req.user = decoded.UserInfo;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = verifyUser;
