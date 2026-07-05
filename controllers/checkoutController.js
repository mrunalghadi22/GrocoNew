const Address = require("../models/Address");
const Product = require("../models/Product");

const checkoutPage = async (req, res) => {
  try {
    const addresses = await Address.find({ user_id: req.session.user.id });
    const isCartFlow = req.query.isCart !== "false";

    let checkoutItems = [];

    let totalItems = 0;

    if (isCartFlow) {

      checkoutItems = res.locals.cart || [];


      checkoutItems.forEach((item) => {

        totalItems += item.quantity;

      });
    } else {

      const singleProduct = await Product.findById(req.query.product_id);
      const qty = parseInt(req.query.quantity) || 1;

      if (singleProduct) {
        checkoutItems = [
          {
            product: singleProduct,
            quantity: qty,
            price: singleProduct.price,
          },
        ];

  
        totalItems = qty;

      }
    }


    res.render("user/checkout", {
      title: "Checkout",
      user: req.session.user,
      addresses,
      checkoutItems,
      isCart: isCartFlow,
      reqQuery: req.query,
      totalItems: totalItems, 
    });
  } catch (err) {
    console.log("Checkout Error:", err);
    res.redirect("/cart");
  }
};
module.exports = {
  checkoutPage,
};
