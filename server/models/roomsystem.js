
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    enum: ['lab', 'seminar hall', 'office'], 
  },
   department: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'GENERAL'], 
  }
});

module.exports = mongoose.model('Room', roomSchema);

