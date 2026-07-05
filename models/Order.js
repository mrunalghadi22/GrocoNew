const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    total_items: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },

    order_status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    payment_status: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      default: "Unpaid",
    },
    payment_method: {
      type: String,
      enum: ["cod", "upi", "paypal"],
      default: "cod",
    },

    razorpay_order_id: {
      type: String,
      default: null,
    },
    razorpay_payment_id: {
      type: String,
      default: null,
    },
    razorpay_signature: {
      type: String,
      default: null,
    },

    tracking_number: {
      type: String,
      default: null,
    },
    delivery_date: {
      type: Date,
      default: null,
    },
    cancel_date: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
