const Booking = require('../models/bookingsystem');
const Room = require('../models/roomsystem');
const Event = require('../models/eventRequest');
const mongoose = require('mongoose');
// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    console.log("Booking Request Body:", req.body);
    const { roomId, date, startTime, endTime, eventRef } = req.body;

    
    if (!eventRef) {
      return res.status(400).json({ message: "Event reference is required for booking." });
    }

    const approvedEvent = await Event.findOne({
      _id: eventRef,
      student: req.user._id,
      status: 'approved',
    });

    if (!approvedEvent) {
      return res.status(403).json({
        message: "Event is not approved or doesn't belong to you.",
      });
    }
    const purpose = approvedEvent.purpose || 'N/A';

    const foundRoom = await Room.findById(roomId);
    if (!foundRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const booking = new Booking({
      user: req.user._id,
      room:roomId,
      date,
      startTime,
      endTime,
      purpose,
      eventRef, 
      notesheetStatus: "approved", 
      roomApprovalStatus: "pending",
    });

    await booking.save();
    return res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({
      message: 'Error creating booking',
      error: error.message,
    });
  }
};


// APPROVE/REJECT ROOM BOOKING BY HOD
const approveRoomBookingByHOD = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: 'Invalid booking ID format' });
}
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status for HOD approval' });
  }

  try {
    
    const booking = await Booking.findById(id).populate('room').populate('user');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Only HODs can perform this action' });
    }
    
    if (!booking.room || !booking.room.department) {
      return res.status(400).json({ message: 'Room department is missing' });
    }

    if (booking.room.department !== req.user.department) {
      return res.status(403).json({
        message: `You can only approve rooms from your department (${req.department})`,
      });
    }

    if (booking.notesheetStatus !== 'approved') {
      return res.status(403).json({ message: 'Event not approved by DSW yet' });
    }

    booking.roomApprovalStatus = status;
    await booking.save();

    res.status(200).json({ message: `Room booking ${status}`, booking });
  } catch (err) {
    console.error("HOD Approval Error:", err);
    res.status(500).json({ message: 'Failed to approve room booking' });
  }
};


// DSW APPROVAL - approve or reject notesheet
const approveOrRejectBooking = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status for DSW approval' });
  }

  try {
    const booking = await Booking.findById(id).populate('user');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

   
    if (req.user.role !== 'admin' ) {
      return res.status(403).json({ message: 'Only DSW can perform this action' });
    }

    booking.notesheetStatus = status;
    await booking.save();

    res.status(200).json({ message: `Notesheet ${status} by DSW`, booking });
  } catch (err) {
    console.error("DSW Approval Error:", err);
    res.status(500).json({ message: 'Failed to process notesheet approval' });
  }
};



const getHODRoomRequests = async (req, res) => {
  try {
      console.log("🎯 Logged-in user (HOD):", req.user);
    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const department = req.user.department;

    const requests = await Booking.find({
      roomApprovalStatus: 'pending',
    })
      .populate('user', 'name email')
      .populate('room', 'roomType department');

   
    const filtered = requests.filter(
      (booking) => booking.room?.department === department
    );
    

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching HOD requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





module.exports = {
  createBooking,
  approveRoomBookingByHOD,
  approveOrRejectBooking,
  getHODRoomRequests,
};

