require('dotenv').config();
const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dbConnect = require('./database/database');

const app = express();

const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  socket.on("room:join", (data) => {
    const { email, roomvd } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(roomvd).emit("user:joined", { email, id: socket.id });
    socket.join(roomvd);
    io.to(socket.id).emit("room:join", data);
  });
});




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
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
