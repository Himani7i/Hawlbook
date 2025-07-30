const User = require('../models/usersystem'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
 

  try {
    const { username, email, password, phone, role, department } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword, phone, role, department, });
      
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '90h' }
    );

  

// res.status(201).json({
//   message: 'User registered successfully',
//   token,
//   user: {
//     _id: newUser._id,
//     username: newUser.username,
//     email: newUser.email,
//     phone: newUser.phone,
//     role: newUser.role,
//     department: newUser.department
//   }
// });
res
  .cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1450 * 1000 * 60
  })
  .status(201)
  .json({
    message: 'User registered successfully',
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      department: newUser.department
    }
  });


  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
};


