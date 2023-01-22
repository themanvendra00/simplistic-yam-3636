const express = require("express");
const { ProductModel } = require("../models/product.model");

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const allproducts = await ProductModel.find();
  res.json(allproducts);
});

productRouter.post("/create", async (req, res) => {
  const data = req.body;
  try {
    const product = new ProductModel(data);
    await product.save();
    res.send("product has been added to database");
  } catch (error) {
    console.log("Error occurred while posting the product data to database");
    console.log(error);
  }
});

// productRouter.patch("/:productID", async (req, res) => {
//   const ID = req.params.productID;

//   const add_data = req.body;
//   try {
//     await ProductModel.findByIdAndUpdate({ _id: ID }, add_data);
//     res.send(`Data with id: ${ID} has Updated successfully`);
//   } catch (error) {
//     console.log("Error occurred while updating the data");
//     console.log(error);
//   }
// });

productRouter.delete("/delete/:id", async (req, res) => {
  const ID = req.params.id;

  try {
    await ProductModel.findByIdAndDelete({ _id: ID });
    res.send(`Data with id: ${ID} has deleted successfully`);
  } catch (error) {
    console.log("Error occurred while deleting the data");
    console.log(error);
  }
});

module.exports = {
  productRouter,
};
