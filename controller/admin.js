const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

exports.getFeatureInfoDetails = async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  const income = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: previousMonth },
        ...(productId && {
          products: { $elemMatch: { productId } },
        }),
      },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$total",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);

  const userCount = await User.countDocuments();
  const productCount = await Product.countDocuments();
  res.status(200).json({ income, users: userCount, products: productCount });
};

exports.getUserDetails = async (req, res) => {
  const { new: isNew } = req.query;

  const users = isNew
    ? await User.find().sort({ _id: -1 }).limit(5)
    : await User.find();
  res.status(200).json({ users });
};

exports.getOrderDetails = async (req, res) => {
  const { new: isNew } = req.query;

  const orders = isNew
    ? await Order.find().sort({ _id: -1 }).limit(12)
    : await Order.find();
  res.status(200).json({ orders });
};
