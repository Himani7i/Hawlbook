
// module.exports = { login };
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const User = require('../models/usersystem');

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const ans = await bcrypt.compare(password, user.password) 
    if (!user || !ans) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};

module.exports = { login };
