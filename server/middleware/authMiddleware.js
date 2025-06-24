const jwt = require('jsonwebtoken');
const User = require('../models/usersystem');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('role department name email');

    if (!user) return res.status(404).json({ message: 'User not found' });

    
    req.user = {
      _id: user._id,
      role: user.role,
      department: user.department,
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authMiddleware };
