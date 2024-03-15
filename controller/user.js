const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const { sendError } = require("../utils/errorHandle");

exports.updateUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "User Not Found");
  const { status } = user;

  user.status = !status;
  user.save();
  res.json({ message: "User Updated Successfully" });
};

exports.findUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User Doesn't Exist");

  const orderQuantity = await Order.countDocuments({ userId });
  const { password, ...others } = user._doc;
  res.status(200).json({ user: { ...others, orderQuantity } });
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User Doesn't Exist");

  await User.findByIdAndDelete(userId);
  await Cart.findOneAndDelete({ userId });

  res.status(200).json({ message: "User Has Been Deleted" });
};

exports.userStats = async (req, res) => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year

  const data = await User.aggregate([
    { $match: { createdAt: { $gte: startOfYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by _id in ascending order
  ]);
  res.status(200).json({ userStats: data });
};
