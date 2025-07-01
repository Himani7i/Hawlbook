require('dotenv').config();
const express = require('express');

const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();


const dbConnect = require('./database/database');

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

app.use(express.json());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}))


app.get('/', (req, res) => res.send('API is running...'));

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


const PORT = process.env.PORT || 5000;
dbConnect().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
