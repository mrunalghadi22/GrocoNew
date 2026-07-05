const Wishlist = require("../models/Wishlist");
const Category = require("../models/Category");

const addToWishlist = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({
        success: false,
        message: "Please login first",
      });
    }

    const userId = req.session.user.id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (exists) {
      return res.json({
        success: false,
        message: "Already in wishlist",
      });
    }

    await Wishlist.create({
      user: userId,
      product: productId,
    });

    res.json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

const removeWishlist = async (req, res) => {
  try {
    console.log("User ID:", req.session.user.id);
    console.log("Product ID:", req.params.id);

    const deleted = await Wishlist.findOneAndDelete({
      user: req.session.user.id,
      product: req.params.id,
    });

    console.log("Deleted:", deleted);

    if (!deleted) {
      return res.json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.json({
      success: true,
      message: "Removed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const wishlistPage = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.session.user.id,
    }).populate({
      path: "product",
      populate: {
        path: "category",
      },
    });
    // console.log(wishlist);
    const categories = await Category.find();
    res.render("user/wishlist", {
      title: "Wishlist",
      wishlist,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const clearWishlist = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({
        success: false,
        message: "Please login first",
      });
    }

    const userId = req.session.user.id;

    await Wishlist.deleteMany({
      user: userId,
    });

    res.json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  wishlistPage,
  addToWishlist,
  removeWishlist,
  clearWishlist,
};
