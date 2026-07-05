const Order = require("../models/Order");
const Product = require("../models/Product");
const PDFDocument = require("pdfkit");

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.session?.user?.id || req.session?.user?._id;

    if (!userId) {
      return res.redirect("/login");
    }

    const orders = await Order.find({
      $or: [{ user_id: userId }, { user: userId }],
    })
      .populate("items.product_id")
      .sort({ createdAt: -1 });

    res.render("user/orders", {
      title: "My Orders",
      user: req.session.user,
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).send("Something went wrong fetching your orders.");
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.session?.user?.id || req.session?.user?._id;

    // Find the order and make sure it belongs to the logged-in user!
    const order = await Order.findOne({
      _id: orderId,
      $or: [{ user_id: userId }, { user: userId }],
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // Only allow cancellation if it hasn't been shipped or delivered yet
    if (
      order.order_status === "Shipped" ||
      order.order_status === "Delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an order that is already on the way.",
      });
    }

    // Update the status and add a cancellation date
    order.order_status = "Cancelled";
    order.cancel_date = new Date();

    await order.save();

    res.json({ success: true, message: "Order cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.session?.user?.id || req.session?.user?._id;

    const order = await Order.findOne({
      _id: orderId,
      $or: [{ user_id: userId }, { user: userId }],
    }).populate("items.product_id");

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    const doc = new PDFDocument({ margin: 50 });
    const shortOrderId = order._id.toString().slice(-6).toUpperCase();

    res.setHeader(
      "Content-disposition",
      `attachment; filename="GROCO-Invoice-${shortOrderId}.pdf"`
    );
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    -doc.fontSize(24).font("Helvetica-Bold").text("GROCO", { align: "center" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Your Daily Grocery Partner", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(16).font("Helvetica-Bold").text("TAX INVOICE");
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica").text(`Order ID: #GROCO-${shortOrderId}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);
    doc.text(`Payment Method: ${order.payment_method.toUpperCase()}`);
    doc.text(`Status: ${order.payment_status}`);
    doc.moveDown(2);

    doc.font("Helvetica-Bold");
    doc.text("Item", 50, doc.y, { continued: true });
    doc.text("Qty", 350, doc.y, { continued: true });
    doc.text("Price", 400, doc.y, { continued: true });
    doc.text("Total", 480, doc.y);

    doc
      .moveTo(50, doc.y + 5)
      .lineTo(550, doc.y + 5)
      .stroke();
    doc.moveDown(1);


    doc.font("Helvetica");
    order.items.forEach((item) => {
      if (item.product_id) {
        let y = doc.y;

  
        let mrp = item.product_id.price;
        let sellingPrice = mrp;

       
        if (item.product_id.discount && item.product_id.discount > 0) {
        
          let discountAmount = mrp * (item.product_id.discount / 100);
          sellingPrice = mrp - discountAmount;
        }

       
        doc.text(item.product_id.name.substring(0, 40), 50, y, {
          width: 280,
          continued: false,
        });
        doc.text(item.quantity.toString(), 350, y, { continued: false });
        doc.text(`Rs. ${sellingPrice.toFixed(2)}`, 400, y, {
          continued: false,
        });
        doc.text(`Rs. ${(sellingPrice * item.quantity).toFixed(2)}`, 480, y, {
          continued: false,
        });
        doc.moveDown(0.5);
      }
    });

    doc
      .moveTo(50, doc.y + 5)
      .lineTo(550, doc.y + 5)
      .stroke();
    doc.moveDown(1);

    doc.font("Helvetica-Bold");
    doc.text(`Grand Total: Rs. ${order.total_price}`, { align: "right" });

    doc.moveDown(4);
    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Thank you for shopping with Groco!", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Error generating invoice.");
  }
};

const getTrackOrderPage = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.session?.user?.id || req.session?.user?._id;

        
        const order = await Order.findOne({ _id: orderId, $or: [{ user_id: userId }, { user: userId }] })
                                 .populate('items.product_id');

        if (!order) {
            return res.status(404).render('user/404', { message: "Order not found" }); // Or redirect to /orders
        }

       
        res.render('user/track-order', {
            title: 'Track Order',
            user: req.session.user,
            order: order
        });

    } catch (error) {
        console.error("Error fetching order for tracking:", error);
        res.redirect('/orders');
    }
};


module.exports = {
    getOrderHistory,
    cancelOrder,
    downloadInvoice,
    getTrackOrderPage 
};
