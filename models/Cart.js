const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    total: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
