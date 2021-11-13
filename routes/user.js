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

  const userPromise = query
    ? User.find().sort({ _id: -1 }).limit(5)
    : User.find();

  userPromise
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.status(500).json(err));
});

// GET USER STATS

router.get("/stats", verifyTokenAndAdmin, (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  // 1. first match all data that has createdAt as greater than last year
  // 2. set a month key with the createdAt month that's being sent
  // 3. group them by setting an _id to the month (e.g november ) and also sum all the users gathered for the particular month
  User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    { $group: { _id: "$month", total: { $sum: 1 } } },
  ])
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
