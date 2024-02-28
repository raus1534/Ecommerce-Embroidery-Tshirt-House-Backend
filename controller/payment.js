const Order = require("../models/Order");
const { sendError } = require("../utils/errorHandle");
const { createSignature } = require("../utils/helper");
const { default: axios } = require("axios");

exports.handleEsewaSuccess = async (req, res, next) => {
  const { data } = req.query;
  const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

  if (decodedData.status !== "COMPLETE") {
    return sendError(res, "Error Occurred");
  }

  const message = decodedData.signed_field_names
    .split(",")
    .map((field) => {
      return `${field}=${decodedData[field] || ""}`;
    })
    .join(",");

  const signature = createSignature(message);

  if (signature !== decodedData.signature) {
    res.json({ message: "Integrity error" });
  }

  req.transaction_uuid = decodedData.transaction_uuid;
  req.transaction_code = decodedData.transaction_code;
  next();
};

exports.handleKhaltiCallback = async (req, res, next) => {
  const { pidx, purchase_order_id, message } = req.query;
  if (message) {
    return res
      .status(400)
      .json({ error: message || "Error Processing Khalti" });
  }

  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: `Key ${process.env.KHALTI_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data.status !== "Completed") {
    return res.status(400).json({ error: "Payment Not Completed" });
  }

  req.transaction_uuid = purchase_order_id;
  req.transaction_code = pidx;
  next();
};

exports.updateChanges = async (req, res) => {
  const { transaction_uuid, transaction_code } = req;
  const order = await Order.findById(transaction_uuid);
  if (!order) return sendError(res, "Order Not Matched");
  order.transactionCode = transaction_code;
  await order.save();
  res.redirect("http://localhost:3000");
};
