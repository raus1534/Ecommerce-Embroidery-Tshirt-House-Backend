const { placeOrder, orderStats, orderDetail } = require("../controller/order");
const { isAuth, isAdmin } = require("../middleware/isAuth");

const Order = require("../models/Order");

const router = require("express").Router();

router.post("/place-order", isAuth, placeOrder);
router.get("/order-stats", isAuth, isAdmin, orderStats);
router.get("/:orderId", isAuth, isAdmin, orderDetail);

module.exports = router;
