const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { sendError } = require("../utils/errorHandle");

exports.addToCart = async (req, res) => {
  const { userId, productDetail, price } = req.body;
  const product = JSON.parse(productDetail);

  const existingCart = await Cart.findOne({ userId });

  if (existingCart) {
    existingCart.products.push(product);
    existingCart.total += price;
    await existingCart.save();
    res.json({ existingCart });
  } else {
    const newCart = new Cart({
      userId,
      products: [product],
      total: price,
    });
    await newCart.save();
    res.json({ newCart });
  }
};
exports.getCartItems = async (req, res) => {
  const { userId } = req.body;

  const existingCart = await Cart.findOne({ userId });

  if (!existingCart) return sendError(res, "No Products Found");

  const cartDetail = await Promise.all(
    existingCart.products.map(async ({ productId, quantity }) => {
      const productDetail = await Product.findById(productId);
      return { productDetail, quantity };
    })
  );

  res.json({ existingCart: cartDetail, total: existingCart.total });
};
