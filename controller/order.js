const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { sendError } = require("../utils/errorHandle");

exports.placeOrder = async (req, res) => {
  const { userId } = req.body;

  const existingCart = await Cart.findOne({ userId });
  const { products, total } = existingCart;
  const order = new Order({
    userId,
    products,
    total,
  });
  if (!order) return sendError(res, "Error Placing Order");
  await order.save();
  await Cart.findOneAndDelete({ userId });
  res.json({ message: "Order Placed" });
};
