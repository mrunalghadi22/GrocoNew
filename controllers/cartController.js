const Cart = require("../models/Cart");
const Category = require("../models/Category");

const miniCart = async (req, res) => {
  const cart = await Cart.find({
    user: req.session.user.id,
  }).populate({
    path: "product",
    populate: {
      path: "category",
    },
  });

  res.render("user/home", {
    cart,
    user: req.session.user,
  });
};

const getMiniCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.session.user.id,
    }).populate({
      path: "product",
      populate: {
        path: "category",
      },
    });

    res.render("partials/mini-cart", {
      cart,
      layout: false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};

const cartPage = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const categories = await Category.find().sort({ category_name: 1 });

    const cart = await Cart.find({
      user: req.session.user.id,
    }).populate({
      path: "product",
      populate: {
        path: "category",
      },
    });

    res.render("user/cart", {
      title: "My Cart",
      cart,
      categories,
      currentCategory: "",
      currentSearch: "",
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const addToCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({
        success: false,
        message: "Please login first",
      });
    }

    const userId = req.session.user.id;
    const { productId, quantity } = req.body;
    // console.log(req.body);

    // console.log("Product ID:", productId);

    const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

    let cartItem = await Cart.findOne({
      user: userId,
      product: productId,
    });

    const qty = Number(quantity) || 1;

    if (product.stock < quantity) {
      
      return res.status(400).json({ 
          success: false, 
          message: "Sorry, this item is out of stock!" 
      });
  }

    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      await Cart.create({
        user: userId,
        product: productId,
        quantity: qty,
      });
    }

    const cartCount = await Cart.countDocuments({
      user: userId,
    });

    res.json({
      success: true,
      message: "Product added to cart",
      cartCount,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.quantity = quantity;
    await cart.save();

    res.json({
      success: true,
      message: "Cart updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

const removeCart = async (req, res) => {
  try {
    const cartId = req.params.id;

    await Cart.findByIdAndDelete(cartId);

    res.json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({
      user: req.session.user.id,
    });

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  cartPage,
  miniCart,
  addToCart,
  updateCart,
  removeCart,
  clearCart,
  getMiniCart,
};
