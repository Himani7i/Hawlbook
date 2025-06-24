
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  date: Date,
  startTime: String,
  endTime: String,
  purpose: String,
  eventRef: { type: mongoose.Schema.Types.ObjectId, ref: 'EventRequest', required: true },

  notesheetPath: { type: String },
  notesheetStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  roomApprovalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });


module.exports = mongoose.model('Booking', bookingSchema);
