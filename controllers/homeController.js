const Category = require("../models/Category");
const Product = require("../models/Product");
const DailyDeal = require("../models/Deal");

const homePage = async (req, res) => {
  try {
    const categories = await Category.find().sort({ category_name: 1 });

    const products = await Product.find({ status: "active" })
      .populate("category")
      .limit(8);

    await DailyDeal.updateMany(
      {
        end_date: { $lt: new Date() },
        deal_status: "active",
      },
      {
        $set: {
          deal_status: "expired",
        },
      }
    );

    const deals = await DailyDeal.find({
      deal_status: "active",
    }).populate({
      path: "product",
      populate: {
        path: "category",
      },
    });
    res.render("user/index", {
      title: "Groco",
      user: req.session.user || null,
      categories,
      currentCategory: "",
      currentSearch: "",
      products,
      deals,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  homePage,
};
