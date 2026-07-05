const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.get('/', orderController.getOrderHistory);


router.put('/cancel/:id', orderController.cancelOrder);

router.get('/invoice/:id', orderController.downloadInvoice);

router.get('/track/:id', orderController.getTrackOrderPage);

module.exports = router;