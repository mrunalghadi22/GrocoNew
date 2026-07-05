const Cart = require("../models/Cart");

const loadCart = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.locals.cart = [];
      return next();
    }

    const cart = await Cart.find({
      user: req.session.user.id,
    }).populate({
      path: "product",
      populate: {
        path: "category",
      },
    });

    res.locals.cart = cart;

    next();
  } catch (err) {
    console.log(err);
    res.locals.cart = [];
    next();
  }
};

module.exports = {loadCart,};