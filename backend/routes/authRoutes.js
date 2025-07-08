const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Solo esto 👇 (sin /api al inicio)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;