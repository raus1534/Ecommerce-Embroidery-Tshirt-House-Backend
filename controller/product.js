const { isValidObjectId } = require("mongoose");
const Product = require("../models/Product");
const { sendError } = require("../utils/errorHandle");

exports.addProduct = async (req, res) => {
  console.log(req.body);
  const newProduct = new Product(req.body);

  const savedProduct = await newProduct.save();
  res.status(200).json(savedProduct);
};

exports.updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(200).json(updatedProduct);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json("Product has been deleted...");

  res.status(500).json(err);
};

exports.findProductById = async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId))
    return sendError("error", "Invalid Product Id");
  const product = await Product.findById(productId);
  if (!product) return sendError("error", "Product Not Found");

  res.json({ product });
};
