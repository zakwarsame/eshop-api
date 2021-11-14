const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

// CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  newOrder
    .save()
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => res.status(500).json(err));
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, (req, res) => {
  Order.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((updatedOrder) => {
      res.status(200).json(updatedOrder);
    })
    .catch((err) => res.status(500).json(err));
});

// DELETE

router.delete("/:id", verifyTokenAndAuth, (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Order deleted successfully"))
    .catch((err) => res.status(500).json(err));
});

// GET USERS ORDERS

router.get("/find/:userId", verifyTokenAndAuth, (req, res) => {
  Order.find({ userId: req.params.userId })
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => res.status(500).json(err));
});

// // GET ALL EXISTING ORDERS (only admin can)

router.get("/", verifyTokenAndAdmin, (req, res) => {
  Order.find()
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(500).json(err));
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  Order.aggregate([
    { $match: { createdAt: { $gte: previousMonth } } },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$amount",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ])
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
