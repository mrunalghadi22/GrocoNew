const DailyDeal = require("../models/Deal");

setInterval(async () => {
  try {
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

    console.log("Expired deals updated");
  } catch (err) {
    console.log(err);
  }
}, 60000); // Runs every 1 minute