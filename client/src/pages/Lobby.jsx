import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const generateRoomID = () => {
    return Math.random().toString(36).substring(2, 10);
  };
const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [roomvd, setRoomvd] = useState(generateRoomID());
  const [copied, setCopied] = useState(false);

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, roomvd });
      console.log("Form submitted with:", { email, roomvd });
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
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 rounded-md bg-[#1c2d45] text-silver border border-gray-500 focus:outline-none focus:ring-2 focus:ring-silver"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
