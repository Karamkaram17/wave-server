const Post = require("../models/post");
const User = require("../models/user");

const getAllUserPosts = async (req, res) => {
  const authorId = req.params.id;
  try {
    const posts = await Post.find({ author: authorId })
      .populate({
        path: "author",
        select:
          "-password -refreshToken -friends -posts -location -createdAt -updatedAt -__v -email",
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select:
            "-password -refreshToken -friends -posts -location -createdAt  -updatedAt -__v -email",
        },
      })
      .exec();
    return res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPostsForUserAndFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send(`no user found`);
    }

    const friendIds = [...user.friends, userId];
    const posts = await Post.find({ author: { $in: friendIds } })
      .populate({
        path: "author",
        select:
          "-password -refreshToken -friends -posts -location -createdAt  -updatedAt -__v -email",
      })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select:
            "-password -refreshToken -friends -posts -location -createdAt  -updatedAt -__v -email",
        },
      })
      .exec();

    if (!posts) {
      return res.status(404).send(`no posts found`);
    }

    return res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json(error);
  }
};

const createPost = async (req, res) => {
  let { description, picture, location } = req.body;
  const user = req.user;
  if (!picture) {
    return res.status(400).json({
      message: " picture is required",
    });
  }
  if (!description) description = "";
  if (!location) location = "";

  try {
    const post = await Post.create({
      picture,
      description,
      location,
      author: user._id,
    });

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json(error);
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.postId;
  const updatedPost = req.body;
  const user = req.user;

  req.body.author ? delete updatedPost.author : null;
  req.body._id ? delete updatedPost._id : null;
  req.body.createdAt ? delete updatedPost.createdAt : null;
  req.body.likes ? delete updatedPost.likes : null;
  req.body.comments ? delete updatedPost.likes : null;

  try {
    await Post.findOneAndUpdate(
      { _id: postId, author: user._id },
      updatedPost,
      {
        new: true,
        runValidators: true,
      }
    );

    res
      .status(200)
      .json({ message: `post with id: ${postId} updated successfully ` });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.postId;
  const user = req.user;

  try {
    const post = await Post.findOneAndDelete({ _id: postId, author: user._id });
    if (!post) {
      return res.status(404).send(`post with id: ${postId} is not found`);
    }
    res.status(200).json({
      message: `post with id : ${post._id} has been successfully deleted `,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const likeOrDislike = async (req, res) => {
  const likerId = req.user._id;
  const postId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: postId });
    const liked = post.likes.includes(likerId) ? true : false;

    liked === true
      ? post.likes.splice(post.likes.indexOf(likerId), 1)
      : post.likes.push(likerId);

    await post.save();

    res.status(200).json({ liked: !liked });
  } catch (error) {
    res.status(500).json(error);
  }
};

const comment = async (req, res) => {
  const user = req.user;
  const postId = req.params.postId;
  const content = req.body.content;
  if (!content) {
    return res.status(400).json({ message: "you need to provide a comment" });
  }
  const comment = {
    content,
    author: user._id,
  };

  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true, useFindAndModify: false }
    );
    const commentId = post.comments.find(
      (c) => c.author.toString() === user._id && c.content === content
    )._id;

    res.status(200).json({ id: commentId });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteComment = async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllUserPosts,
  createPost,
  updatePost,
  deletePost,
  likeOrDislike,
  comment,
  deleteComment,
  getPostsForUserAndFriends,
};
