const {
  placeOrder,
  orderStats,
  orderDetail,
  updateOrderDetail,
} = require("../controller/order");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const Order = require("../models/Order");

const router = require("express").Router();

router.post("/place-order", isAuth, placeOrder);
router.get("/order-stats", isAuth, isAdmin, orderStats);
router.get("/:orderId", isAuth, isAdmin, orderDetail);
router.put("/:orderId", isAuth, isAdmin, updateOrderDetail);

module.exports = router;
