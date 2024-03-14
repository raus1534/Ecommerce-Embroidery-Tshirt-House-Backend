const mongoose = require("mongoose");
const { generateRandomString } = require("../utils/helper");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    total: {
      type: Number,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    shippingContact: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionCode: {
      type: String,
      default: generateRandomString(),
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Delivered"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
