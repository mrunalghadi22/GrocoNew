const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const Category = require("../models/Category");

const categories = [
    {
      sqlId: 1,
      category_name: "Snacks & Beverages",
      icon_class: "fa-cookie-bite",
      cat_img: "c2.png",
    },
    {
      sqlId: 2,
      category_name: "Packaged Food",
      icon_class: "fa-box",
      cat_img: "c3.png",
    },
    {
      sqlId: 3,
      category_name: "Personal & Baby Care",
      icon_class: "fa-baby",
      cat_img: "c4.png",
    },
    {
      sqlId: 4,
      category_name: "Staples",
      icon_class: "fa-utensils",
      cat_img: "c5.png",
    },
    {
      sqlId: 5,
      category_name: "Dairy Products",
      icon_class: "fa-cheese",
      cat_img: "c6.png",
    },
    {
      sqlId: 6,
      category_name: "Home & Kitchen",
      icon_class: "fa-home",
      cat_img: "c7.png",
    },
  ];

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Category.insertMany(categories);

    console.log("✅ Categories Seeded Successfully");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCategories();