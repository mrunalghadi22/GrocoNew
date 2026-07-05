const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require('express-session');
const connectMongoRaw = require('connect-mongo');
// const expressLayouts = require("express-ejs-layouts");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const shoppingRoutes = require("./routes/shoppingRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const {loadCart} = require("./middleware/cartMiddleware");
const profileRoutes = require("./routes/profileRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require('./routes/orderRoutes');
const catMiddleware = require('./middleware/catMiddleware');
const adminRoutes = require('./routes/adminRoutes');





const connectDB = require("./config/db");

const app = express();

// Database
connectDB();



// Start deal scheduler
// require("./utils/dealScheduler");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, "public")));





let myMongoStore;


if (connectMongoRaw && typeof connectMongoRaw.create === 'function') {
    myMongoStore = connectMongoRaw.create({ mongoUrl: process.env.MONGO_URI });
} 

else if (connectMongoRaw && connectMongoRaw.default && typeof connectMongoRaw.default.create === 'function') {
    myMongoStore = connectMongoRaw.default.create({ mongoUrl: process.env.MONGO_URI });
} 

else if (typeof connectMongoRaw === 'function') {
    const MongoStoreOld = connectMongoRaw(session);
    myMongoStore = new MongoStoreOld({ url: process.env.MONGO_URI });
} 

else {
  
    console.log("DETECTIVE MODE: WHAT IS NODE SEEING?");
    console.log(connectMongoRaw);

    throw new Error("connect-mongo is unrecognized! Check the logs above.");
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: myMongoStore
}));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.use(catMiddleware);

app.use(loadCart);
app.use("/", authRoutes);
app.use("/", homeRoutes);
app.use("/", shoppingRoutes);
app.use("/", productRoutes);
app.use("/", wishlistRoutes);
app.use("/", cartRoutes);
app.use("/", profileRoutes);
app.use("/", checkoutRoutes);
app.use('/payment', paymentRoutes);
app.use('/orders', orderRoutes);


app.use('/admin', adminRoutes);





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const DailyDeal = require('./models/Deal');
const Product = require('./models/Product');


setInterval(async () => {
    try {
        const now = new Date();


        const expiredDeals = await DailyDeal.find({ deal_end: { $lt: now } });

        if (expiredDeals.length > 0) {
            console.log(`Found ${expiredDeals.length} expired deals. Cleaning up...`);

            for (let deal of expiredDeals) {
              
                await Product.findByIdAndUpdate(deal.product_id, {
                    'deal-status': 'expired'
                });

         
                await DailyDeal.findByIdAndDelete(deal._id);
                
                console.log(`Successfully removed expired deal for Product ID: ${deal.product_id}`);
            }
        }
    } catch (error) {
        console.error("Error in expired deals background cleanup:", error);
    }
}, 10000);