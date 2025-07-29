
import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; 
import { useSocket } from "../context/SocketProvider";

function HODDashboard() {
  const [requests, setRequests] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
 const navigate = useNavigate();
 const socket = useSocket();

 useEffect(() => {
    if (user?.email && socket) {
      socket.emit("admin:register", { email: user.email });
      // console.log("HOD socket registered with email:", user.email);
    }
  }, [socket, user]);
  
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

useEffect(() => {
  socket.on("admin:incoming-call", ({ from, roomvd }) => {
    setIncomingCall({ from, roomvd });
  });

  return () => {
    socket.off("admin:incoming-call");
  };
}, [socket]);
 


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

const handleJoinCall = () => {
  if (incomingCall?.roomvd && user?.email && socket) {
    socket.emit("room:join", {
      email: user.email,
      roomvd: incomingCall.roomvd
    });
    navigate(`/roomvd/${incomingCall.roomvd}`);
  }
};
const handleRejectCall = () => {
  if (incomingCall?.from) {
      socket.emit('admin:reject-call', { to: incomingCall.from.trim() }); 
    }
  setIncomingCall(null); 
};


  return (
    <div className="min-h-screen bg-vintageDark text-vintageLight p-10 font-serif">
      <h1 className="text-4xl mb-6 text-center font-bold text-vintageAccent">🏫 Department Head - Room Approval Panel</h1>

      {requests.length === 0 ? (
        <p className="text-center text-white">No pending room approvals.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-16">
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
      {incomingCall && (
  <div className="fixed top-6 right-6 bg-[#12263a] text-silver p-4 rounded-xl shadow-lg border border-silver z-50 w-80">
    <h2 className="text-lg font-bold mb-2">Incoming Video Call</h2>
    <p className="mb-1"><span className="font-semibold">From:</span> {incomingCall.from}</p>
    <p className="mb-4"><span className="font-semibold">Room ID:</span> {incomingCall.roomvd}</p>
    <div className="flex gap-3 justify-end">
      <button
        onClick={handleJoinCall}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
      >
        Join Call
      </button>
      <button
        onClick={handleRejectCall}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
      >
        Reject
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default HODDashboard;
