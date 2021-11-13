const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
// REGISTER

router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASSWORD
    ).toString(),
  });

  newUser
    .save()
    .then((savedUser) => {
      res.status(200).json(savedUser);
    })
    .catch((err) => res.status(500).json(err));
});

// LOGIN

router.post("/login", (req, res) => {
  const user = User.findOne({ username: req.body.username }).then((user) => {
    !user && res.status(401).json("wrong credentials");
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_PASSWORD
    );
    const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    userPassword !== req.body.password && res.status(401).json("wrong credentials")

    const {password, ...others} = user._doc
    res.status(200).json(others)
  }).catch((err) => res.status(500).json(err));
});

module.exports = router;
