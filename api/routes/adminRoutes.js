
const express = require('express');
const router = express.Router();
const AdminController = require('../controller/adminController')

// Admin routes
router.post('/login', AdminController.login);
router.post('/register', AdminController.register);



module.exports = router;

