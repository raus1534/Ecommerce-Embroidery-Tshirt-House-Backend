const {
  getFeatureInfoDetails,
  getUserDetails,
  getOrderDetails,
  getNewsLetters,
} = require("../controller/admin");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const router = require("express").Router();

router.get("/feature-info", isAuth, isAdmin, getFeatureInfoDetails);
router.get("/user-details", isAuth, isAdmin, getUserDetails);
router.get("/order-details", isAuth, isAdmin, getOrderDetails);
router.get("/get-newsletters", isAuth, isAdmin, getNewsLetters);

module.exports = router;
