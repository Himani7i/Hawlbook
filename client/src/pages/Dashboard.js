import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-hot-toast';
import { FileUp } from 'lucide-react';
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
const [purpose, setPurpose] = useState('');
const [date, setDate] = useState('');
const socket = useSocket();
const navigate = useNavigate();

useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get('/booking/my-bookings');
        setBookings(res.data);
      } catch (err) {
        toast.error('Failed to fetch your bookings');
      }
    };
    fetchBookings();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
const handleUpload = async () => {
  if (!file) return toast.error("Please choose a file first");
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

if (!allowedTypes.includes(file.type)) {
  return toast.error("Invalid file type. Only images and documents allowed.");
}
  if (!title || !purpose || !date) {
    return toast.error("Please fill in all fields.");
  }
  const formData = new FormData();
  formData.append("notesheet", file);
  formData.append("title", title);
 formData.append("purpose", purpose);
 formData.append("date", date);

  // const token = localStorage.getItem("token"); 

  setUploading(true);
  try {
    const res = await API.post('/event/submit', formData, { withCredentials: true,
    });

    toast.success("Notesheet uploaded successfully");
  } catch (error) {
    toast.error("Upload failed");
    console.error("Upload error:", error.response?.data || error.message);
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-r from-vintageBlue-dark to-vintageDark text-white  p-6 font-serif">
      <h2 className="text-4xl font-bold text-vintageAccent mb-8 text-center">🎓 Student Dashboard</h2>

      <div className="max-w-3xl mx-auto space-y-6">
      
        <div className="bg-vintageDark p-6 rounded-lg shadow-md border border-vintageAccent">
          <h3 className="text-xl mb-2 font-semibold text-vintageAccent">📄 Upload Notesheet for Event Approval</h3>
<div className="flex flex-col gap-4">
  <input
    type="text"
    placeholder="Event Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="p-2 rounded bg-vintageBlue-dark text-gray-400"
    required
  />
  <input
    type="text"
    placeholder="Purpose of Event"
    value={purpose}
    onChange={(e) => setPurpose(e.target.value)}
    className="p-2 rounded bg-vintageBlue-dark text-gray-400"
    required
  />
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="p-2 rounded bg-vintageBlue-dark text-gray-400"
    required
  />
  <input
    type="file"
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    onChange={handleFileChange}
    className="text-gray-400"
    required
  />
  <button
    onClick={handleUpload}
    disabled={uploading}
    className="flex items-center gap-2 justify-center bg-vintageAccent text-vintageDark font-semibold px-4 py-2 rounded hover:bg-opacity-80 transition"
  >
    <FileUp className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Notesheet'}
  </button>
</div>

        </div>

    
        <div className="bg-vintageDark p-6 rounded-lg shadow-md border  border-vintageAccent">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-vintageAccent">📅 My Bookings</h3>
            <Link to="/bookings" className="bg-vintageAccent px-3 py-1 rounded-md text-vintageDark font-bold hover:bg-opacity-80 transition">
              + New Booking
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="mt-4 text-gray-300">No bookings yet. Upload a notesheet and create one!</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {bookings.map(b => (
                <li
                  key={b._id}
                  className="p-4 border border-vintageAccent bg-white bg-opacity-10 rounded-lg"
                >
                  <p><strong className='text-gray-300'>Room:</strong> {b.room?.roomType || 'N/A'}</p>
                  <p><strong className='text-gray-300'> Department:</strong> {b.room?.department || 'N/A'}</p>

                  <p><strong className='text-gray-300'>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
                  <p><strong className='text-gray-300'>Time:</strong> {b.startTime} - {b.endTime}</p>
                  <p><strong className='text-gray-300'>Status:</strong> <span className="capitalize text-yellow-300">{b.roomApprovalStatus}</span></p>
                  <p><strong className='text-gray-300'> Event Title:</strong> {b.eventRef?.title || 'N/A'}</p>
                  <p><strong className='text-gray-300'>Purpose:</strong> {b.eventRef?.purpose || 'N/A'}</p>
                  <p><strong className='text-gray-300'>Notesheet Status:</strong> 
                  <span className={
                   b.notesheetStatus === 'approved' ? 'text-green-400' :
                   b.notesheetStatus === 'rejected' ? 'text-red-400' :
                   'text-yellow-300'
                 }>
                   {b.notesheetStatus}
                 </span>
                 </p>
                 {(b.roomApprovalStatus === 'pending' || b.notesheetStatus === 'pending') && (
  <div className="mt-3 flex gap-3">
    <button
      onClick={() => {
        toast.success("Lobby");
        navigate('/lobby');
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
    >Call HOD/DSW
    </button>
    
  </div>
)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

