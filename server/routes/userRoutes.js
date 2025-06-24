const express = require('express');
const router = express.Router();
const {signup} = require('../controllers/userController');
const User = require('../models/usersystem'); 


router.post('/signup', signup);

router.get("/roles", (req, res) => {
  try {
    const roles = User.getRoles(); 
    res.json({ roles });
  } catch (error) {
    res.status(500).json({ message: "Failed to get roles" });
  }
});

module.exports = router;
