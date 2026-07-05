const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    sqlId: {
      type: Number,
      required: true,
      unique: true,
    },
    category_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    icon_class: {
      type: String,
      default: "fa-tag",
    },

    cat_img: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
