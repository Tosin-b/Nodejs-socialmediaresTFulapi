const router = require("express").Router();
const User = require("../models/User");
const bycryt = require("bcrypt");
const { response } = require("express");
router.get("/", (req, res) => {
  res.send("helloow word");
});

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //Genreate new password
    const salt = await bycryt.genSalt(10);
    const hashedPassword = await bycryt.hash(req.body.password, salt);

    //Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500)

  }
});
//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send("User not found");
    const validPassword = await bycryt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(404).send("Wrong password");

    res.status(200).json(user)

  } catch (err) {
    console.log(err);
    res.status(500)
  }
});

module.exports = router;
