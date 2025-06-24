const Room = require('../models/roomsystem');

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.json({rooms});
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching rooms' });
  }
};


module.exports = { getRooms };
