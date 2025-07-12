import React,{useEffect, useCallback, useState} from 'react';
import {useSocket} from '../context/SocketProvider';
import ReactPlayer from 'react-player';
import peer from '../context/peer';
const RoomPage = () =>{
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  

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
   

   useEffect(() => {
        socket.on("user:joined", handleUserJoined);
   
     return () => {
        socket.off("user:joined", handleUserJoined);
     };

    }, [socket, handleUserJoined]);


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Room Page</h1>
           <div>
           {myStream && <button onClick={sendStreams}>Send Stream</button>}
           {remoteSocketId && <button  onClick={handleCallUser}>Call</button>}
           {myStream && (
           <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      </div>

        </div>
        </div>
    );
}

export default RoomPage;