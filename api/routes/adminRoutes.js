
const express = require('express');
const router = express.Router();
const AdminController = require('../controller/adminController')

// Admin routes
router.post('/login', AdminController.login);
router.post('/register', AdminController.register);

// Product routes
// router.post('/products', AdminController.createProduct);
// router.get('/products/:productId', AdminController.getProduct);
// router.put('/products/:productId', AdminController.updateProduct);
// router.delete('/products/:productId', AdminController.deleteProduct);

module.exports = router;

