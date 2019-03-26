const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    id: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    title: {
      type: String,
      required: [true, "product title is required"]
    },
    image: {
      type: String,
      required: [true, "please add product image"]
    },
    price: {
      type: Number,
      required: [true, "product price is required"]
    },
    producer: {
      type: String,
      default: "unknown"
    },
    inCart: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
