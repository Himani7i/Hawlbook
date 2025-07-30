// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
module.exports = router;
