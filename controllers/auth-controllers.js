const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const HandleRegistration = async (req, res) => {
  const { firstName, lastName, email, password, picture } = req.body;
  let location = req.body.location;
  if (!firstName || !lastName || !email || !password || !picture) {
    return res.status(400).json({
      message: "firstName ,lastName ,email ,picture and password are required",
    });
  }
  if (!location) location = "";
  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "password must be more than 5 characters" });
  }

  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) {
    return res.sendStatus(409);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      picture,
      location,
    });
    res.status(201).json({
      success: `user : ${result.firstName} has been successfully created`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const user = await User.findOne({ email: email.toLowerCase() }).exec();
  if (!user) {
    return res.sendStatus(401);
  }
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const UserInfo = {
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      _id: user._id,
    };

    const newUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      posts: user.posts,
      friends: user.friends,
      picture: user.picture,
      location: user.location,
      profileViews: user.profileViews,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const accessToken = jwt.sign(
      { UserInfo },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3600s",
      }
    );

    const refreshToken = jwt.sign(
      { UserInfo },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "86400s",
      }
    );
    //saving refreshToken with the current user
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken, UserInfo: newUser });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin, HandleRegistration };
