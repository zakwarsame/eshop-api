const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

// CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  newProduct
    .save()
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => res.status(500).json(err));
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, (req, res) => {
  Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((updatedProduct) => {
      res.status(200).json(updatedProduct);
    })
    .catch((err) => res.status(500).json(err));
});

// DELETE

router.delete("/:id", verifyTokenAndAdmin, (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Product deleted successfully"))
    .catch((err) => res.status(500).json(err));
});

// GET A PRODUCT

router.get("/find/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => res.status(500).json(err));
});

// GET ALL EXISTING PRODUCTS

router.get("/", (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;

  let productPromise;

  if (queryNew) {
    productPromise = Product.find().sort({ createdAt: -1 }).limit(5);
  } else if (queryCategory) {
    productPromise = Product.find({
      categories: {
        $in: [queryCategory],
      },
    });
  } else {
    productPromise = Product.find()
  }

  productPromise
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((err) => res.status(500).json(err));
});


module.exports = router;
