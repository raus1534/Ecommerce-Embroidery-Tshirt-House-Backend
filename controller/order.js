const { default: axios } = require("axios");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { sendError } = require("../utils/errorHandle");
const { createSignature } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("mongodb");

exports.placeOrder = async (req, res) => {
  const { userId, shippingAddress, shippingContact, payment_method } = req.body;

  const existingCart = await Cart.findOne({ userId });
  const { products, total } = existingCart;
  const order = new Order({
    userId,
    products,
    total,
    shippingAddress,
    shippingContact,
    paymentMethod: payment_method,
  });
  if (!order) return sendError(res, "Error Placing Order");
  await order.save();
  await Cart.findOneAndDelete({ userId });

  if (payment_method === "Cash On Delivery") {
    res.json({ message: "Order Placed Succsesfully" });
  }
  if (payment_method === "eSewa") {
    const signature = createSignature(
      `total_amount=${order.total},transaction_uuid=${order._id},product_code=EPAYTEST`
    );

    const formData = {
      amount: order.total,
      failure_url: "https://google.com",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:8000/api/payment/esewa/success",
      tax_amount: "0",
      total_amount: order.total,
      transaction_uuid: order._id,
    };
    res.json({ message: "Order Placed Successfully", formData });
  }

  if (payment_method === "Khalti") {
    const formData = {
      return_url: "http://localhost:8000/api/payment/khalti/callback",
      website_url: "http://localhost:8000",
      amount: order.total * 100, //paisa
      purchase_order_id: order._id,
      purchase_order_name: "test",
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      formData,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({
      message: "Order Placed Successfully",
      payment_method: "khalti",
      data: response.data,
    });
  }
};

exports.orderStats = async (req, res) => {
  const currentDate = new Date();
  const thirtyDaysAgo = new Date(currentDate);
  thirtyDaysAgo.setDate(currentDate.getDate() - 30);

  const ordersStats = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: thirtyDaysAgo,
          $lte: currentDate,
        },
      },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
        total: "$total",
      },
    },
    {
      $group: {
        _id: { month: "$month", day: "$day" },
        totalAmount: { $sum: "$total" },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.month": 1, // Sort by month in ascending order
        "_id.day": 1, // Then sort by day in ascending order
      },
    },
  ]);

  res.json({ ordersStats });
};

exports.orderDetail = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return sendError(res, "Order Id is Missing");
  }

  if (!isValidObjectId(orderId)) {
    return sendError(res, "Invalid Order Id");
  }

  const order = await Order.aggregate([
    {
      $match: {
        _id: ObjectId.createFromHexString(orderId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user", // Unwind the user array
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "populatedProducts",
      },
    },
    {
      $addFields: {
        productsDetail: "$populatedProducts",
      },
    },
    {
      $project: {
        populatedProducts: 0,
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  if (!order || order.length === 0) {
    return sendError(res, "Order Not Found");
  }

  res.json({ order: order[0] });
};
exports.updateOrderDetail = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) return sendError(res, "Order Id is Missing");

  if (!isValidObjectId(orderId)) return sendError(res, "Invalid Order Id");

  const order = await Order.findById(orderId);
  if (!order) return sendError(res, "Order Not Found");
  order.status = "Delivered";
  order.save();
  res.json({ message: "Order Updated Successfully" });
};

exports.getOrdersDetail = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return sendError(res, "User Id Not Found");
  if (!isValidObjectId(userId)) return sendError(res, "Invalid User Id");

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json({ orders });
};
