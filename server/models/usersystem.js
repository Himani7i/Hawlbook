const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const rolesEnum = ['admin','HOD', 'student'];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  phone: {
    type: String,
    default: '0000000000',
  },
  role: {
    type: String,
    enum: rolesEnum,
    default: 'student',
  },
   department: {
    type: String,
    enum: ['CSE', 'ECE', 'GENERAL'],
    default: 'GENERAL',
  }
});


userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

userSchema.statics.getRoles = () => rolesEnum;

module.exports = mongoose.model('User', userSchema);
