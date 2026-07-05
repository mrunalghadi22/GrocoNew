require("dotenv").config();

const connectDB = require("../config/db");
const DailyDeal = require("../models/Deal");
const Product = require("../models/Product");

const deals = [
  {
    product_id: 1,
    start_date: new Date("2025-02-25T17:24:00"),
    end_date: new Date("2025-03-04T18:59:00"),
    deal_status: "active",
  },
  {
    product_id: 2,
    start_date: new Date("2025-02-25T17:02:00"),
    end_date: new Date("2025-02-28T18:59:00"),
    deal_status: "active",
  },
  {
    product_id: 15,
    start_date: new Date("2025-02-25T18:24:00"),
    end_date: new Date("2025-02-28T18:59:00"),
    deal_status: "active",
  },
];

const seedDeals = async () => {
  try {
    await connectDB();

    await DailyDeal.deleteMany();

    for (const item of deals) {
      // Get all products in insertion order
      const products = await Product.find().sort({ createdAt: 1 });

      // Convert SQL product_id (1,2,15) to MongoDB document
      const product = products[item.product_id - 1];

      if (!product) {
        console.log(`Product not found for SQL ID ${item.product_id}`);
        continue;
      }

      await DailyDeal.create({
        product: product._id,
        start_date: item.start_date,
        end_date: item.end_date,
        deal_status: item.deal_status,
      });
    }

    console.log("✅ Daily Deals Seeded Successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDeals();