const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

// CREATE

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  newCart
    .save()
    .then((cart) => {
      res.status(200).json(cart);
    })
    .catch((err) => res.status(500).json(err));
});

// UPDATE
router.put("/:id", verifyTokenAndAuth, (req, res) => {
  Cart.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((updatedCart) => {
      res.status(200).json(updatedCart);
    })
    .catch((err) => res.status(500).json(err));
});

// DELETE

router.delete("/:id", verifyTokenAndAuth, (req, res) => {
  Cart.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Cart deleted successfully"))
    .catch((err) => res.status(500).json(err));
});

// GET USERS CART

router.get("/find/:userId", verifyTokenAndAuth, (req, res) => {
  Cart.findOne({ userId: req.params.userId })
    .then((cart) => {
      res.status(200).json(cart);
    })
    .catch((err) => res.status(500).json(err));
});

// // GET ALL EXISTING CART (only admin can)

router.get("/", verifyTokenAndAdmin, (req, res) => {
  Cart.find()
    .then((cart) => res.status(200).json(cart))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
