
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { isLoggedIn } = require("../middleware/authMiddleware");


router.post("/create-order", isLoggedIn, paymentController.createPaymentOrder);

router.post("/verify-payment", paymentController.verifyPaymentAndSaveOrder);

router.post("/cod-order", paymentController.processCodOrder);

module.exports = router;