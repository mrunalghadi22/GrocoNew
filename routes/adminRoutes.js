const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const Order = require('../models/Order'); 
const Product = require('../models/Product');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        
        cb(null, 'img_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


router.get('/', adminController.adminPage);


router.get('/api/orders', adminController.getAllOrders);
router.get('/api/products', adminController.getProductTable);
router.get('/api/products/:id', adminController.getSingleProduct);
router.delete('/api/products/:id', adminController.deleteProduct);

router.put('/orders/update-status', adminController.updateOrderStatus);

router.post('/api/products/update', upload.single('image1'), adminController.updateProduct);


router.get('/api/add-product', adminController.getAddProductForm);

router.post('/api/products/add', upload.single('image1'), adminController.addProduct);

module.exports = router;