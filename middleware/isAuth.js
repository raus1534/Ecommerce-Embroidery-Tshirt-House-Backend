const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/errorHandle");

exports.isAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return sendError(res, "Unauthorized Access");

  try {
    const { user } = jwt.verify(authorization, process.env.JWT_SEC);
    const userData = await User.findById(user._id);
    if (!userData) return sendError(res, "User Profile Doesn't Exist");

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Handle expired token error
      return res.json({
        tokenExpire: true,
      });
    } else {
      // Handle other errors, such as invalid signature or malformed token
      return sendError(res, "Invalid Token");
    }
  }
};

exports.isAdmin = async (req, res, next) => {
  const { user } = req;
  if (!user?.isAdmin) return sendError(res, "Unauthorized Access");
  next();
};
