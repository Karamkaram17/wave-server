const User = require("../models/user");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    const modifiedUsers = users.map((user) => {
      const newUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        location: user.location,
      };
      return newUser;
    });
    res.status(200).json({ users: modifiedUsers });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).send(`no user found`);
    }
    const newUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      friends: user.friends,
      picture: user.picture,
      location: user.location,
      createdAt: user.createdAt,
    };

    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const _id = req.user._id;

  const updatedUser = req.body;
  req.body.email ? delete updatedUser.email : null;
  req.body.refreshToken ? delete updatedUser.refreshToken : null;
  req.body.firstName ? delete updatedUser.firstName : null;
  req.body.lastName ? delete updatedUser.lastName : null;
  req.body.friends ? delete updatedUser.lastName : null;
  req.body.createdAt ? delete updatedUser.lastName : null;

  if (req.body.password) {
    if (req.body.password.length < 5) {
      return res
        .status(400)
        .json({ message: "password should be longer than 5 characters" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    updatedUser.password = hashedPassword;
  }

  try {
    const user = await User.findOneAndUpdate({ _id }, updatedUser, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send(` user with id: ${_id} is not a found`);
    }
    res.status(200).send();
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteUser = async (req, res) => {
  const _id = req.user._id;

  try {
    const user = await User.findOneAndDelete({ _id });
    if (!user) {
      return res.status(404).send(`user with id: ${_id} is not a found`);
    }
    res.status(200).json({
      message: `user with email : ${user.email} has been successfully deleted `,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addOrRemoveFriendship = async (req, res) => {
  const userId = req.user._id;
  const friendId = req.params.friendId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send(` user with id: ${userId} is not found`);
    }

    user.friends.includes(friendId)
      ? user.friends.splice(user.friends.indexOf(friendId), 1)
      : user.friends.push(friendId);

    await user.save();

    res.status(200).send();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  addOrRemoveFriendship,
};
