const router = require("express").Router();
const { response } = require("express");
const Post = require("../models/Post");
const User = require("../models/User");

//create psot
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(201).json("Updated");
    } else {
      res.status(403).res("you can only update your own posts");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Teh post has been deleted");
    } else {
      res.status(403).res("you can only delete your own posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like a posts
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("you like this post");
    } else if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("you disliked this post");
    }
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
});
//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});
// get all posts
//GET TIMELINE PSOTS
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    console.log(userPosts);
    const friendPost = await Promise.all(
      currentUser.following.map((friend) => {
        return Post.find({ userId: friend });
      })
    );
    console.log(friendPost);

    res.status(200).json(userPosts.concat(...friendPost));
    //console.log(userPosts.concat(...friendPost))
  } catch (err) {
    res.status(404).json(err);
    console.log(err);
  }
});
// get all users posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    //console.log(user)
    const posts = await Post.find({ userId: user._id });
    console.log(posts)

    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", (req, res) => {
  console.log("Post page");
});

module.exports = router;
