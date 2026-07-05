const Razorpay = require("razorpay");
const Order = require("../models/Order");
const crypto = require("crypto");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_T8z7oBF8O1q63p",
  key_secret: "JU5q1L9otBfE4zFk0PiGnab2",
});

const expectedDelivery = new Date();
expectedDelivery.setDate(expectedDelivery.getDate() + 5);

const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: options.amount,
      key_id: "rzp_test_T8z7oBF8O1q63p",
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate payment." });
  }
};

const verifyPaymentAndSaveOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      totalItems,
      totalAmount,
      cartItems,
    } = req.body;
    console.log(cartItems);

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const userId = req.session?.user?.id || req.session?.user?._id;

    const expectedSign = crypto
      .createHmac("sha256", "JU5q1L9otBfE4zFk0PiGnab2")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const newOrder = new Order({
        user_id: req.session?.user?.id || "650c1f11b9876c0012345678",

        items: (cartItems || []).map((item) => ({
          product_id: item.product._id || item.product,
          quantity: item.quantity,

          price: item.price || (item.product && item.product.price),
        })),

        address_id: addressId,
        total_items: totalItems || 1,
        total_price: totalAmount,
        payment_method: "upi",
        payment_status: "Paid",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,

        delivery_date: expectedDelivery,
      });

      await newOrder.save();

      for (let item of newOrder.items) {
        const deductAmount = -Math.abs(Number(item.quantity));

        console.log(
          `Deducting ${deductAmount} from Product ID: ${item.product_id}`
        );

        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { stock: deductAmount },
        });
      }

      await Cart.deleteMany({
        $or: [{ user: userId }, { user_id: userId }],
      });

      return res.json({
        success: true,
        message: "Payment verified and order saved!",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during verification." });
  }
};

const processCodOrder = async (req, res) => {
  try {
    const { addressId, totalItems, totalAmount, cartItems } = req.body;

    const newOrder = new Order({
      user_id: req.session?.user?.id || "650c1f11b9876c0012345678",

      items: (cartItems || []).map((item) => ({
        product_id: item.product._id || item.product,
        quantity: item.quantity,
        price: item.price || (item.product && item.product.price),
      })),

      address_id: addressId,
      total_items: totalItems || 1,
      total_price: totalAmount,
      payment_method: "cod",
      payment_status: "Unpaid",
    });

    await newOrder.save();

    for (let item of newOrder.items) {
      const deductAmount = -Math.abs(Number(item.quantity));

      console.log(
        `Deducting ${deductAmount} from Product ID: ${item.product_id}`
      );

      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock: deductAmount },
      });
    }

    try {
      const userId = req.session?.user?.id || req.session?.user?._id;
      if (userId) {
        await Cart.deleteMany({
          $or: [{ user: userId }, { user_id: userId }],
        });
      }
    } catch (cartErr) {
      console.error("Non-fatal error clearing cart:", cartErr);
    }

    return res.json({
      success: true,
      message: "COD Order placed successfully!",
    });
  } catch (error) {
    console.error("Error processing COD order:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during COD checkout." });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentAndSaveOrder,
  processCodOrder,
};
