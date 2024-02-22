const User = require("../models/User");

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
  const user = await User.findById(req.params.id);
  const { password, ...others } = user._doc;
  res.status(200).json(others);
  res.status(500).json(err);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json("User has been deleted...");

  res.status(500).json(err);
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
