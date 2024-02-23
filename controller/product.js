const Product = require("../models/Product");
const { sendError } = require("../utils/errorHandle");

exports.addProduct = async (req, res) => {
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
  const product = await Product.findById(req.params.id);
  if (!product) return sendError(res, "Product Not Found");
  res.status(200).json(product);
};
