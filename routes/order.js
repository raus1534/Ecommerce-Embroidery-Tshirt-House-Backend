const { placeOrder } = require("../controller/order");
const { isAuth } = require("../middleware/isAuth");

const Order = require("../models/Order");

const router = require("express").Router();

router.post("/place-order", isAuth, placeOrder);

module.exports = router;
