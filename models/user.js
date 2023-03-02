const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "must provide a name"],
      trim: true,
      maxlength: [25, "name cannot be more than 25 characters"],
      minlength: [3, "username cannot be less than 5 characters"],
    },

    lastName: {
      type: String,
      required: [true, "must provide a name"],
      trim: true,
      maxlength: [25, "name cannot be more than 25 characters"],
      minlength: [3, "username cannot be less than 5 characters"],
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "must provide a password"],
    },

    friends: {
      type: Array,
      default: [],
    },

    picture: {
      type: String,
    },

    location: { type: String },

    refreshToken: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("newUser", UserSchema);
module.exports = User;
