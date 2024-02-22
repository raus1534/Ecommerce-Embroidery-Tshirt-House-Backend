const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/errorHandle");

exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;
  const newUser = new User({
    name,
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
  });

  await newUser.save();
  res.json({ newUser });
};

exports.loginUser = async (req, res) => {
  const { username } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json("Wrong1 credentials!");

  const hashedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASS_SEC
  );
  const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  if (OriginalPassword !== req.body.password)
    return sendError(res, "Wrong Credentials");

  const accessToken = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SEC,
    { expiresIn: "3d" }
  );
  const { password, ...others } = user._doc;
  res.status(200).json({ user: { ...others, accessToken } });
};
