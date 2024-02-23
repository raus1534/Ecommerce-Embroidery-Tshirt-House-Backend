const { placeOrder } = require("../controller/order");
const { isAuth } = require("../middleware/isAuth");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const Order = require("../models/Order");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});

router.post("/place-order", isAuth, placeOrder);
router.get("/income", async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
