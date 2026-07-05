const Product = require("../models/Product");
const Rating = require("../models/Rating");
const Category = require("../models/Category");


const productDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    const categories = await Category.find();

    if (!product) {
      return res.redirect("/shopping");
    }

    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    }).limit(8);


    const reviews = await Rating.find({
      product: product._id,
    })
      .populate("user")
      .sort({ createdAt: -1 });

    res.render("user/product-details", {
      title: product.name,
      product,
      relatedProducts,
      reviews,
      categories,               
      currentCategory: "",      
      currentSearch: "",
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/shopping");
  }
};

const addRating = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    console.log(req.session.user);

    const { rating, review } = req.body;
    const productId = req.params.id;
    const userId = req.session.user.id;

    let existing = await Rating.findOne({
      product: productId,
      user: userId,
    });

    if (existing) {
      existing.rating = Number(rating);
      existing.review = review;
      await existing.save();
    } else {
      await Rating.create({
        product: productId,
        user: userId,
        rating: Number(rating),
        review,
      });
    }

    res.redirect(`/product/${productId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
};

module.exports = {
  productDetails,
  addRating,
};