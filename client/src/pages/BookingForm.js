
import React, { useState, useEffect } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const BookingForm = () => {
  
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
//   const [user, setUser] = useState(() => {
//   const storedUser = localStorage.getItem('user');
//   return storedUser ? JSON.parse(storedUser) : null;
// });
const [user, setUser] = useState(null);


  const [formData, setFormData] = useState({
    roomId: '',
    eventTitle: '',
    date: '',
    startTime: '',
    endTime: '',
     eventRef: '',
  });
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await API.get('/v1/auth/me', { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      toast.error("Not logged in 😢");
    }
  };

  fetchUser();
}, []);

  useEffect(() => {
      const fetchEvents = async () => {
    try {
      const res = await API.get('/event/approved', { withCredentials: true });
      //  console.log('Approved Events:', res.data);
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load your approved events');
      console.error(err);
    }
  };
    const fetchRooms = async () => {
      try {
        const res = await API.get('/room/all', { withCredentials: true });
        // console.log('Rooms:', res.data.rooms);
        setRooms(res.data.rooms);
      } catch (err) {
        toast.error('Failed to load rooms 😢');
        console.error(err);
      }
    };
    fetchEvents();
    fetchRooms();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/booking/book',formData, { withCredentials: true });
      toast.success('Room booked successfully 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed 💥');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-8 rounded-2xl shadow-xl w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Room Booking Form</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={user?.username || ''}
            readOnly
            className="p-3 border rounded-xl bg-gray-100"
          />
          <input
            type="email"
            value={user?.email}
            readOnly
            className="p-3 border rounded-xl bg-gray-100"
          />
          
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            className="p-3 border rounded-xl"
          >
            <option value="">Select a Room</option>
            {Array.isArray(rooms) && rooms.map((room) => (
  <option key={room._id} value={room._id}>
    {room.roomType} ({room.department})
  </option>
))}

          </select>

        <select
  name="eventRef"
  value={formData.eventRef}
  onChange={handleChange}
  required
  className="p-3 border rounded-xl"
>
  <option value="">Select Approved Event</option>
  {Array.isArray(events) && events.map((event) => (
  <option key={event._id} value={event._id}>
    {event.title || 'Untitled Event'}
  </option>
))}

</select>
{formData.eventRef && (
  <div className="bg-blue-100 text-blue-900 p-3 rounded-lg">
    <p><strong>Selected Event:</strong> {
      events.find(e => e._id === formData.eventRef)?.title
    }</p>
    <p><strong>Purpose:</strong> {
      events.find(e => e._id === formData.eventRef)?.purpose || 'N/A'
    }</p>
  </div>
)}


          <input
            type="date"
            name="date"
            className="p-3 border rounded-xl"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="startTime"
            className="p-3 border rounded-xl"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="endTime"
            className="p-3 border rounded-xl"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-700 hover:bg-blue-900 text-white py-3 rounded-xl font-semibold transition duration-200"
        >
          Book Room
        </button>
      </form>
    </div>
  );
};

export default BookingForm;


