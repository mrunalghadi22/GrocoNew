const mongoose = require("mongoose");

const dailyDealSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    start_date: {
      type: Date,
      required: true,
    },

    end_date: {
      type: Date,
      required: true,
    },

    deal_status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

dailyDealSchema.index({ end_date: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("DailyDeal", dailyDealSchema);