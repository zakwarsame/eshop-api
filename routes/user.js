const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

// UPDATE
router.put("/:id", verifyTokenAndAuth, (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_PASSWORD
    ).toString();

    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => res.status(500).json(err));
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAuth, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("User deleted successfully"))
    .catch((err) => res.status(500).json(err));
});

// GET A USER

router.get("/find/:id", verifyTokenAndAdmin, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    })
    .catch((err) => res.status(500).json(err));
});

// GET ALL EXISTING USERS

router.get("/", verifyTokenAndAdmin, (req, res) => {
  const query = req.query.new;

  const userPromise = query ? User.find().sort({ _id: -1 }).limit(1) : User.find();

  userPromise
    .then((users) => {

      res.status(200).json(users);
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
