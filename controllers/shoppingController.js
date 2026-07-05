const Product = require("../models/Product");
const Category = require("../models/Category");

const shoppingPage = async (req, res) => {
  try {
    const { search, tag, category } = req.query;

    const searchText = search || tag || "";

    const categories = await Category.find();

    let filter = {};

    if (category && category !== "All Categories") {
      const cat = await Category.findOne({ category_name: category });

      if (cat) {
        filter.category = cat._id;
      } else {
        filter.category = null;
      }
    }

    if (searchText) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { keywords: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    res.render("user/shopping", {
      title: "Shopping",
      categories,
      products,
      selectedCategory: category || "",
      search: search || "",
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  shoppingPage,
};