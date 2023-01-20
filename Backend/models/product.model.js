const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  hovimage: String,
  head: String,
  price: Number,
  tag: String,
  category: String,
  date: Number,
  availability: Boolean,
  image: String,
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = { ProductModel };
