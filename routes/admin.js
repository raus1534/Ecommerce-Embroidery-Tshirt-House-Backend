const {
  getFeatureInfoDetails,
  getUserDetails,
  getOrderDetails,
} = require("../controller/admin");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const router = require("express").Router();

router.get("/feature-info", isAuth, isAdmin, getFeatureInfoDetails);
router.get("/user-details", isAuth, isAdmin, getUserDetails);
router.get("/order-details", isAuth, isAdmin, getOrderDetails);

module.exports = router;
