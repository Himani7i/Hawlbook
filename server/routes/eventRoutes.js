// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Event = require('../models/eventRequest');
const nodemailer = require('nodemailer');
const { uploadToCloudinary, isFileTypeSupported } = require('../utils/fileUploader');

const fs = require('fs');


require('dotenv').config();


router.post('/submit', authMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files.notesheet) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    
    const file = req.files.notesheet;
    const ext = file.name.split('.').pop();
    // console.log("Received file:", req.files);
    // console.log("Received fields:", req.body);

    if (!isFileTypeSupported(ext)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type. Only images, PDFs, and DOCs allowed.",
      });
    }
    const result = await uploadToCloudinary(file, "event_notesheets");

    const event = await Event.create({
      student: req.user._id,
      file: result.secure_url,
      date:req.body.date,
      purpose: req.body.purpose,
      title: req.body.title,
    });

    res.status(201).json({ message: "Notesheet uploaded", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/decision/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

    const { status, remarks } = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, { status, remarks }, { new: true }).populate('student');

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: event.student.email,
      subject: `Event ${status.toUpperCase()}`,
      text: `Hi ${event.student.username}, your event is ${status}. Remarks: ${remarks || 'None'}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: `Event ${status}`, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/pending', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

    const pendingEvents = await Event.find({ status: 'pending' }).populate('student');
    res.json(pendingEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/approved', authMiddleware, async (req, res) => {
  try {
    const approvedEvents = await Event.find({
      student: req.user._id,
      status: 'approved'
    });
    res.json(approvedEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
