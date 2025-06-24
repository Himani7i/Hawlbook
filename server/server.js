require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
// Middleware
// ✅ Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use(cors({
  origin: 'http://localhost:3000', // your frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));
// Health check
app.get('/', (req, res) => res.send('API is running...'));

// Routes
const authRoutes    = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes    = require('./routes/userRoutes');
const roomRoutes    = require('./routes/roomRoutes');
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/v1/auth',    authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/v1/user',    userRoutes);
app.use('/api/room',    roomRoutes);
app.use('/api/event', eventRoutes);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
