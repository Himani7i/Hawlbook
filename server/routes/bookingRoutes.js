// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');
const Booking = require('../models/bookingsystem'); 

router.get('/my-bookings',authMiddleware, async (req, res) => {
   try {
    const userId = req.user._id; 
    const bookedrooms = await Booking.find({ user: userId })
      .populate('user', 'username email') 
      .populate('room', 'roomType department')
      .populate('eventRef', 'title purpose status'); 
    res.json(bookedrooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});


router.put('/hod/decision/:id', authMiddleware, bookingController.approveRoomBookingByHOD);
router.get('/hod/requests', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'HOD') {
      return res.status(403).json({ message: 'Only HODs can access this' });
    }

    const requests = await Booking.find({
      notesheetStatus: 'approved',
      roomApprovalStatus: 'pending',
      
    })
    .populate('user', 'username email')
    .populate('room', 'roomType department') 
    .populate('eventRef', 'title purpose');


    
    const filtered = requests.filter(r => r.room?.department === req.user.department);

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Error fetching HOD requests:", error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// User bookings
router.post('/book', authMiddleware, bookingController.createBooking);

module.exports = router;
