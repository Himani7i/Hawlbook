import React,{useEffect, useCallback, useState, useRef} from 'react';
import {useSocket} from '../context/SocketProvider';
import peer from '../context/peer';
import { toast } from 'react-hot-toast';

const RoomPage = () =>{
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if(myVideoRef.current && myStream){
      myVideoRef.current.srcObject = myStream;
      myVideoRef.current.play().catch((e) => {
      console.error("Failed to play local stream:", e);
    });
    }
  }, [myStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
       remoteVideoRef.current.play().catch((e) => {
      console.error("Failed to play remote stream:", e);
    });
    }
  }, [remoteStream]);


  const handleUserJoined = useCallback(({ email, id}) =>{
    console.log(`Email: ${email} joined room`);
    setRemoteSocketId(id);
  }, []);


  const handleCallUser = useCallback(async () => {
    const stream  = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true });

        const offer = await peer.getOffer();
        socket.emit("user:call",{ to : remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, socket]);
     
    const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleIncomingCall = useCallback(
    async ({from, offer}) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setMyStream(stream);
      console.log("Incoming call from:", from,offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("user:answer", { to: from, answer: ans });  
    },[socket]);

    const handleCallAccepted = useCallback(
      ({from,ans}) => {
        peer.setLocalDescription(ans);
        console.log("Call Accepted");
        sendStreams();
      },
      [sendStreams]);

      const handleNegoNeeded = useCallback(async () => {
       const offer = await peer.getOffer();
       socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
       }, [remoteSocketId, socket]);

      useEffect(() => {
       peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
       return () => {
       peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
       };
      }, [handleNegoNeeded]);

      const handleNegoNeedIncomming = useCallback(
      async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
      },
      [socket]);

      const handleNegoNeedFinal = useCallback(async ({ ans }) => {
      await peer.setLocalDescription(ans);
      }, []);


      useEffect(() => {
      peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
      });
      }, []);
          
  useEffect(() => {
  socket.on("admin:call-rejected", () => {
    toast.error("Call was rejected by admin 😕");
  });
  return () => socket.off("admin:call-rejected");
  }, [socket]);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);
     return () => {
        socket.off("user:joined", handleUserJoined);
        socket.off("incomming:call", handleIncomingCall);
        socket.off("call:accepted", handleCallAccepted);
        socket.off("peer:nego:needed", handleNegoNeedIncomming);
        socket.off("peer:nego:final", handleNegoNeedFinal);
     };

    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoNeedIncomming,handleNegoNeedFinal, ]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen  bg-[#0D1B2A] space-y-3 p-6">
        <div className="bg-[#1B263B] p-8 rounded-2xl shadow-md w-full max-w-5xl mx-auto border border-blue-700 min-h-[80vh]">
            <h1 className="text-2xl font-bold mb-8 text-center text-white">Room Page</h1>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {myStream && (
            <div className="flex flex-col items-center">
              <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            className="w-[450px] h-[350px] rounded-lg shadow-md border-2 border-blue-800 "
          />
          <span className="mt-3 text-lg font-semibold text-blue-300">My Stream</span>
          </div>
        )}
        {remoteStream && (
          <div className="flex flex-col items-center">
            <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-[450px] h-[350px] rounded-lg shadow-md border-2 border-blue-800"
          />
         <span className="mt-3 text-lg font-semibold text-blue-300">Remote Stream</span>
          </div>
        )}

        </div>
         <div className="space-x-4 items-center justify-center flex mt-6">
          {myStream && (
          <button
            onClick={sendStreams}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-emerald-500 transition"
          >
            Send Stream
          </button>
        )}
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-cyan-500 transition"
          >
            Call
          </button>
        )}
         </div>
        </div>
        </div>
    );
}

export default RoomPage;