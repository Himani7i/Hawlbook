// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.get('/all',authMiddleware, roomController.getRooms);

module.exports = router;
