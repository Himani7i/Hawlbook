import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import axios from "axios";
import { toast } from 'react-hot-toast';
const generateRoomID = () => {
    return Math.random().toString(36).substring(2, 10);
  };
const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [roomvd, setRoomvd] = useState(generateRoomID());
  const [copied, setCopied] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/admins`); 
        setAdmins(res.data);
        //  console.log("Fetched admins:", res.data); 
      } catch (err) {
        console.error("Error fetching admins", err);
      }
    };
    fetchAdmins();
  }, []);

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, roomvd });
      // console.log("Form submitted with:", { email, roomvd });
    },
    [email, roomvd, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { roomvd } = data;
      navigate(`/roomvd/${roomvd}`);
    },
    [navigate]
  );

  

  const handleGenerateRoom = () => {
    const newRoom = generateRoomID();
    setRoomvd(newRoom);
    setCopied(false);
  };

  const handleCopy = () => {
    if (roomvd) {
      navigator.clipboard.writeText(roomvd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
   
  const handleCallAdmin = (admin) => {
    if (!admin || !admin.email) {
    toast.error("Please select a valid admin.");
    return;
  }
    if (!roomvd) {
    toast.error("Room ID not generated yet!");
    return;
  }
    socket.emit("room:call", {
      from: email,
      to: admin.email,
      roomvd: roomvd,
    });
    navigate(`/roomvd/${roomvd}`);
  };

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen bg-[#0a1a2f] text-[#c0c0c0] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmitForm}
        className="bg-[#12263a] w-full max-w-md p-8 rounded-xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 border-b pb-2 border-silver text-center">
          Lobby
        </h1>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">
           Your Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 rounded-md bg-[#1c2d45] text-silver border border-gray-500 focus:outline-none focus:ring-2 focus:ring-silver"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@mitsgwl.ac.in"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="roomvd" className="block mb-2 font-semibold">
            Room ID:
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="text"
              id="roomvd"
              className="w-full px-4 py-2 rounded-md bg-[#1c2d45] text-silver border border-gray-500 focus:outline-none focus:ring-2 focus:ring-silver"
              value={roomvd}
              onChange={(e) => setRoomvd(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGenerateRoom}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md transition"
              >
                Generate
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Calling Buttons */}
      <div className="w-full max-w-md bg-[#12263a] p-6 rounded-xl shadow-lg">
     
  
  <h2 className="text-xl font-semibold mb-4 text-center">Call Admin</h2>

  <div className="mb-4">
    <label htmlFor="admin-select" className="block mb-2 font-semibold">
      Select an Admin:
    </label>
    <select
      id="admin-select"
      value={selectedAdminId}
      onChange={(e) => setSelectedAdminId(e.target.value)}

      className="w-full px-4 py-2 rounded-md bg-[#1c2d45] text-silver border border-gray-500 focus:outline-none focus:ring-2 focus:ring-silver"
    >
      <option value="">-- Choose an admin --</option>
      {admins.map((admin) => (
        <option key={admin._id} value={admin._id}>
          {admin.username} ({admin.role})
        </option>
      ))}
    </select>
  </div>

  <button
    onClick={() => {
     const admin = admins.find((a) => a._id === selectedAdminId);
     handleCallAdmin(admin);
     }}
     disabled={!selectedAdminId}

    className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-md transition w-full disabled:opacity-50"
  >
    {selectedAdminId 
  ? `Call ${admins.find((a) => a._id === selectedAdminId)?.username}` 
  : "Select Admin to Call"}

  </button>


      </div>

        <button
          type="submit"
          className="w-full bg-[#0d3b66] hover:bg-[#155d8b] text-white font-bold py-2 rounded-md transition"
        >
          Create & Join Room
        </button>
      </form>
    </div>
  );
};

export default LobbyScreen;
