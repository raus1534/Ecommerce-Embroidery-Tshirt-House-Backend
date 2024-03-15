const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/errorHandle");

exports.registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const isExisting = await User.findOne({ email });
  if (isExisting) return sendError(res, "User Already Exist");

  const name = firstName + " " + lastName;

  const newUser = new User({
    name,
    username,
    email,
    password,
  });

  await newUser.save();
  res.json({ user: newUser });
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return sendError(res, "User Doesn't Exist");

  const comparePassword = await user.comparePassword(password);

  if (!comparePassword) return sendError(res, "Wrong Credentials");

  if (!user.status) return sendError(res, "Account Disabled!!");

  const accessToken = jwt.sign(
    {
      user,
    },
    process.env.JWT_SEC,
    { expiresIn: "3d" }
  );
  const { password: newPassword, ...others } = user._doc;
  res.status(200).json({ user: { ...others, accessToken } });
};

exports.setAuthInfo = async (req, res) => {
  const { user } = req;
  res.json({ user });
};
