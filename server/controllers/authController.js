
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

    // res.json({ token, user });
  res.cookie("token", token, {
  httpOnly: true,
  secure: true, 
  sameSite: "None", 
  maxAge:  1450 * 1000 * 60
});
res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};


module.exports = { login, logout , getMe};
