const User = require("../models/User");
const { verifyToken, verifyTokenAndAuth } = require("./verifyToken");
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

module.exports = router;
