const { isValidObjectId } = require("mongoose");
const Product = require("../models/Product");
const { sendError } = require("../utils/errorHandle");

exports.addProduct = async (req, res) => {
  const { title, desc, categories, size, color, price, inStock, img } =
    req.body;
  const newProduct = new Product({
    title,
    desc,
    categories,
    size,
    color,
    price,
    inStock,
    img,
  });

  await newProduct.save();
  res.json({ message: "Product Add Successfully" });
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { title, desc, categories, size, color, price, inStock, img } =
    req.body;
  const updatedProduct = await Product.findByIdAndUpdate(productId);
  if (!updatedProduct) return sendError(res, "Product Not Found");

  updatedProduct.title = title;
  updatedProduct.desc = desc;
  updatedProduct.categories = categories;
  updatedProduct.size = size;
  updatedProduct.color = color;
  updatedProduct.price = price;
  updatedProduct.inStock = inStock;
  if (img) {
    updatedProduct.img = img;
  }
  updatedProduct.save();
  res.status(200).json({ message: "Product Updated Successfully" });
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  await Product.findByIdAndDelete(productId);
  res.status(200).json({ message: "Product Has Been Deleted..." });
};

exports.findProductById = async (req, res) => {
  const { productId } = req?.params;
  if (!isValidObjectId(productId))
    return sendError("error", "Invalid Product Id");
  const product = await Product.findById(productId);
  if (!product) return sendError("error", "Product Not Found");

  res.json({ product });
};

exports.getProducts = async (req, res) => {
  let qNew = req.query.new;
  const qCategory = req.query.category;

  let products;
  if (qCategory === "unisex")
    products = await Product.find({}).sort({ createdAt: -1 });
  else if (qNew) {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(1);
  } else if (qCategory) {
    products = await Product.find({
      categories: qCategory,
    });
  } else {
    products = await Product.find().sort({ createdAt: -1 });
  }
  if (!products) return sendError(res, "Products Not Found");

  res.status(200).json({ products });
};
