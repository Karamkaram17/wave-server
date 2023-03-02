const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newUser",
      required: true,
    },

    comments: [
      {
        content: { type: String, required: true },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "newUser",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    picture: {
      type: String,
    },

    location: { type: String },

    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", PostSchema);
module.exports = Post;
