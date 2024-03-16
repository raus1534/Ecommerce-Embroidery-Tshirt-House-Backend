const {
  placeOrder,
  orderStats,
  orderDetail,
  updateOrderDetail,
  getOrdersDetail,
} = require("../controller/order");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const Order = require("../models/Order");

const router = require("express").Router();

router.post("/place-order", isAuth, placeOrder);
router.get("/order-stats", isAuth, isAdmin, orderStats);
router.get("/order-detail/:userId", isAuth, getOrdersDetail);
router.get("/:orderId", isAuth, orderDetail);
router.put("/:orderId", isAuth, isAdmin, updateOrderDetail);

module.exports = router;
