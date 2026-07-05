const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { loadCart } = require("../middleware/cartMiddleware");


router.get("/checkout", isLoggedIn, loadCart, checkoutController.checkoutPage);


module.exports = router;
