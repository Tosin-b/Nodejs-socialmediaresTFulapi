const router = require("express").Router();
const bycryt = require("bcrypt");
const User = require("../models/User");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bycryt.genSalt(10);
        hashedPasswortd = await bycryt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).send("Account has been Updated");
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).json("you Can only update your account!");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(204).console.log("Account has been deleted");
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).json("you Can only delete your account!");
  }
});
//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    console.log(user);
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).send(others);
  } catch (err) {
    //console.log(err);
    return res.status(500).json(err);
  }
});
//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId); 
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json("User has benn followed");
      } else {
        res.status(403).send("you follow this user already");
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).json("you cant follow yourself!");
  }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("you dont follow this user");
      } else {
        res.status(403).send("you already follow this User");
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  } else {
    return res.status(403).json("you cant unfollow yourself!");
  }
});

module.exports = router;
