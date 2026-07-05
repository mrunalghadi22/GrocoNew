const Order = require("../models/Order");
const Product = require("../models/Product");
const Category = require("../models/Category");
const DailyDeal = require('../models/Deal'); 
// admin page
const adminPage = (req, res) => {
  res.render("admin/admin");
};

const getAllOrders = async (req, res) => {
  try {
    
    const orders = await Order.find({})
      .populate("user_id", "first_name last_name email mob_num")
      .populate("items.product_id", "name price image1")
      .populate("address_id") // <--- ADD THIS LINE
      .sort({ createdAt: -1 });

    
    res.render("admin/partials/orders-table", {
      orders: orders,
      layout: false,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).send("Server error loading orders.");
  }
};

updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;


    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

   
    if (status === "Cancelled" && order.order_status !== "Cancelled") {
      for (let item of order.items) {
        await Product.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock: item.quantity } } 
        );
      }
      order.cancel_date = new Date();
    }

    
    order.order_status = status;

    if (status === "Delivered") order.updatedAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: `Order updated to ${status} successfully!`,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error updating status." });
  }
};

const getProductTable = async (req, res) => {
  try {
    const [products, categories] = await Promise.all([
      Product.find({}).sort({ createdAt: -1 }),
      Category.find({}),
    ]);

    res.render("admin/partials/products-table", {
      products: products,
      categories: categories,
      layout: false,
    });
  } catch (error) {
    console.error("Error loading products table:", error);
    res.status(500).send("<p>Error loading product data.</p>");
  }
};

const getSingleProduct = async (req, res) => {
  try {
   
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

   
  } catch (error) {
    console.error("Error fetching single product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
  
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found to delete." });
    }

   
    res.json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error deleting product." });
  }
};



const updateProduct = async (req, res) => {
  try {
   
    const {
      product_id,
      name,
      description,
      keywords,
      price,
      discount,
      stock,
      category_id,
      deal_start, 
      deal_end
    } = req.body;

    
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

   
    product.name = name;
    product.description = description;
    product.keywords = keywords;
    product.price = price;
    product.discount = discount;
    product.stock = stock;
    
   
    product.category = category_id; 

   
    product.weight_unit = req.body["weight-unit"];
    product.status = req.body.status;
    
   
    product['deal-status'] = req.body['deal-status'];

    if (req.file) {
     
      product.images = [`/uploads/${req.file.filename}`];
    }

    await product.save();

 
    const dealStatus = req.body['deal-status'];
    
    if (dealStatus === 'active') {
       
        await DailyDeal.findOneAndUpdate(
            { product: product._id }, 
            {
                product: product._id,
                start_date: deal_start, 
                end_date: deal_end,     
                deal_status: 'active'
            },
            { upsert: true, new: true } 
        );
        console.log(`Product ${product._id} synced to Daily Deals!`);
        
    } else if (dealStatus === 'inactive' || dealStatus === 'expired') {
       
        await DailyDeal.findOneAndDelete({ product: product._id });
        console.log(`Product ${product._id} removed from Daily Deals.`);
    }
   
    res.redirect("/admin");
    
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Server Error updating product");
  }
};

const getAddProductForm = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/partials/add-product", {
      categories: categories,
      layout: false,
    });
  } catch (error) {
    res.status(500).send("Error loading form.");
  }
};

const addProduct = async (req, res) => {
  try {
    console.log("TEXT FIELDS:", req.body);
    console.log("FILE UPLOAD:", req.file);
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      keywords: req.body.keywords,
      price: req.body.price,
      discount: req.body.discount,
      stock: req.body.stock,
      category: req.body.category_id,
      weight_unit: req.body["weight-unit"],
      status: req.body.status,
      
      images: req.file ? [`/uploads/${req.file.filename}`] : [],
    });

    await newProduct.save();

  
    res.redirect("/admin");
  } catch (error) {
    console.error("Error saving new product:", error);
    res.status(500).send("Server Error adding product");
  }
};

module.exports = {
  adminPage,
  getAllOrders,
  updateOrderStatus,
  getProductTable,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  getAddProductForm,
  addProduct,
};
