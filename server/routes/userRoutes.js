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

router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "Admin", "HOD", "hod"] } });
    console.log("Fetched admins:", admins);
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});


module.exports = router;
