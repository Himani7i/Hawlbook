import React,{useEffect, useCallback, useState, useRef} from 'react';
import {useSocket} from '../context/SocketProvider';
import peer from '../context/peer';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 space-y-6 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Room Page</h1>
        <div className="flex space-x-4">
          {myStream && (
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            className="w-[300px] h-[200px] rounded-lg shadow"
          />
        )}
        {remoteStream && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-[300px] h-[200px] rounded-lg shadow"
          />
        )}

        </div>
         <div className="space-x-4">
          {myStream && (
          <button
            onClick={sendStreams}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send Stream
          </button>
        )}
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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