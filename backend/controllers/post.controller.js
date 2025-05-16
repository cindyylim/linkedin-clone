import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeedPosts: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  const { content, image } = req.body;
  let newPost;

  try {
    if (image) {
      const imageRes = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imageRes.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }
    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in deletePost controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const likePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
      const newNotification = new Notification({
        recipient: post.author,
        type: "like",
        relatedUser: userId,
        relatedPost: postId,
      });
      await newNotification.save();
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in likePost controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPostById = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createComment = async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");
    if (post.author.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: id,
      });
      await newNotification.save();
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in createComment controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
