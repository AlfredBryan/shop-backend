const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const Product = require("../models/product");

const router = express.Router();

// Image Upload Configuration with multer and cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "products",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 200, height: 200, crop: "limit" }]
});

const parser = multer({ storage: storage }).single("image");

// Fetch all products
router.get("/products", (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      res.status(404).send("products not found");
      return;
    }
    res.status(201).send(products);
  });
});

// Create new Product
router.post("/product/create", parser, (req, res) => {
  // Check for field errors
  const id = req.body.id;
  const title = req.body.title;
  const image = req.file.secure_url;
  const price = req.body.price;
  const producer = req.body.producer;

  // Return error if no Id is provided
  if (!id) {
    return res.status(422).send({ error: "please login" });
  }

  // Return error if no Title is provided
  if (!title) {
    return res.status(422).send({ error: "please enter title" });
  }

  // Return error if no Image is provided
  if (!image) {
    return res.status(422).send({ error: "please insert image" });
  }

  // Return error if no Price is provided
  if (!price) {
    return res.status(422).send({ error: "please enter product price" });
  }

  // Return error if no Producer is provided
  if (!producer) {
    return res.status(422).send({ error: "please enter producer" });
  }

  Product.create(
    {
      id,
      title,
      image,
      price,
      producer
    },
    (err, product) => {
      if (err) return res.status(500).send({ message: err.message });

      res.status(200).send(product);
    }
  );
});

router.get("/search", function(req, res) {
  let noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    Product.find(
      {
        $or: [{ title: regex }, { producer: regex }, { price: regex }]
      },
      (err, products) => {
        if (err) {
          res.status(404).send(err.message);
        }
        if (workers.length < 1) {
          noMatch = "No product match that query, please try again";
        }
        res.send({ result: products, noMatch: noMatch });
      }
    ).limit(10);
  } else {
    Product.find({}, (err, products) => {
      if (err) res.send(err.message);
      res.send(products);
    });
  }
});

module.exports = router;
