// models/eventRequest.js
const mongoose = require("mongoose");

const eventRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  file: String, 
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  purpose:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    required: true  
  },
  title: {
    type: String,
    required: true
  } 
});

module.exports = mongoose.model("EventRequest", eventRequestSchema);
