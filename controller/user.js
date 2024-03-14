const Cart = require("../models/Cart");
const User = require("../models/User");
const { sendError } = require("../utils/errorHandle");

exports.updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(200).json(updatedUser);

  res.status(500).json(err);
};

exports.findUserById = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User Doesn't Exist");
  const { password, ...others } = user._doc;
  res.status(200).json({ user: others });
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

