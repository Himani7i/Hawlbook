
import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-hot-toast';

function HODDashboard() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

useEffect(() => {
  const fetchRoomRequests = async () => {
    try {
      const res = await API.get('/booking/hod/requests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRequests(res.data); 
    } catch (error) {
      console.error('Error fetching HOD requests:', error);
      toast.error('Failed to load HOD room requests');
    }
  };
  fetchRoomRequests();
}, []);


const handleDecision = async (bookingId, action) => {
  try {
    const res = await API.put(
      `/booking/hod/decision/${bookingId}`,
      { status: action }, 
      {
        headers: {
            'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    toast.success(`Booking ${action}ed successfully!`);
    setRequests(prev => prev.filter(r => r._id !== bookingId));
  } catch (error) {
    toast.error('Failed to update booking status');
    console.error('HOD decision error:', error);
  }
};


  return (
    <div className="min-h-screen bg-vintageDark text-vintageLight p-10 font-serif">
      <h1 className="text-4xl mb-6 text-center font-bold text-vintageAccent">🏫 Department Head - Room Approval Panel</h1>

      {requests.length === 0 ? (
        <p className="text-center text-white">No pending room approvals.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req._id} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md border border-vintageAccent backdrop-blur-md">
              <p><strong>👤 Student:</strong> {req.user?.username}</p>
              <p><strong>📌 Event Title:</strong> {req.eventRef?.title || 'Untitled'}</p>
              <p><strong>📧 Email:</strong> {req.user?.email}</p>
              <p><strong>🏠 Room:</strong> {req.room?.roomType}</p>
              <p><strong>📅 Date:</strong> {new Date(req.date).toLocaleDateString()}</p>
              <p><strong>🕓 Time:</strong> {req.startTime} - {req.endTime}</p>
              <p><strong>🎯 Purpose:</strong> {req.eventRef?.purpose || 'N/A'}</p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleDecision(req._id, 'approved')}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white font-bold"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(req._id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-bold"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HODDashboard;
