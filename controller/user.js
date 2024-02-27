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

  res.status(200).json("User Has Been Deleted");
};

exports.getStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
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
  ]);
  res.status(200).json(data);
};
