const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/errorHandle");

exports.isAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return sendError(res, "Unauthorized Access");

  const { user } = jwt.verify(authorization, process.env.JWT_SEC);

  const userData = await User.findById(user._id);
  if (!userData) return sendError(res, "User Profile Doesn't Exist");

  req.user = user;
  
  next();
};
