let mongoose = require("mongoose");

let orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    shippingAddress: {
      type: Object,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    items: [],
    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "cancelled"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);