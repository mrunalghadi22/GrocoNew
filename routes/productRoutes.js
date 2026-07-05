const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/product/:id", productController.productDetails);
router.post("/product/:id/rating", productController.addRating);

module.exports = router;