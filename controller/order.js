const { default: axios } = require("axios");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { sendError } = require("../utils/errorHandle");
const { createSignature } = require("../utils/helper");

exports.placeOrder = async (req, res) => {
  const { userId, shippingAddress, payment_method } = req.body;

  const existingCart = await Cart.findOne({ userId });
  const { products, total } = existingCart;
  const order = new Order({
    userId,
    products,
    total,
    shippingAddress,
    paymentMethod: payment_method,
  });
  if (!order) return sendError(res, "Error Placing Order");
  await order.save();
  await Cart.findOneAndDelete({ userId });

  if (payment_method === "cashOnDelivery") {
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

  if (payment_method === "khalti") {
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
