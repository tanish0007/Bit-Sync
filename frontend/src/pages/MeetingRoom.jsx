// src/pages/MeetingRoom.jsx
import { useEffect } from 'react';  // Add this import
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { connectSocket, disconnectSocket } from '../services/socket';
import useWebRTC from '../hooks/UseWebRTC';
import UserVideo from '../components/meetingComponents/UserVideo';
import RemoteVideo from '../components/meetingComponents/RemoteVideo';
import ChatPanel from '../components/meetingComponents/ChatPanel';
import Controls from '../components/meetingComponents/Controls';

const MeetingRoom = () => {
  const { roomId } = useParams();
  const userId = uuidv4();
  const { clients, provideMediaRef } = useWebRTC(roomId, userId);

  useEffect(() => {
    connectSocket(roomId, userId);
    return () => disconnectSocket();
  }, [roomId, userId]);

  const getGridClass = () => {
    const remoteClients = clients.filter(id => id !== userId).length;
    if (remoteClients <= 1) return 'grid-cols-1';
    if (remoteClients <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 text-white">
      <div className={`flex-1 grid ${getGridClass()} gap-4 p-4 overflow-auto`}>
        {clients.map(clientId => (
          <div key={clientId} className={
            clientId === userId 
              ? "fixed bottom-4 right-4 w-80 h-60 z-10"
              : "w-full h-full min-h-[200px]"
          }>
            {clientId === userId ? (
              <UserVideo clientId={clientId} provideMediaRef={provideMediaRef} />
            ) : (
              <RemoteVideo clientId={clientId} provideMediaRef={provideMediaRef} />
            )}
          </div>
        ))}
      </div>
      
      <div className="w-full md:w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <Controls roomId={roomId} />
        <ChatPanel roomId={roomId} userId={userId} />
      </div>
    </div>
  );
};

export default MeetingRoom;

// import { useParams } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
// import UserVideo from "../components/meetingComponents/UserVideo";
// import RemoteVideo from "../components/meetingComponents/RemoteVideo";
// import ChatPanel from "../components/meetingComponents/ChatPanel";
// import Controls from "../components/meetingComponents/Controls";
// import useWebRTC from "../hooks/UseWebRTC";

// const MeetingRoom = () => {
//   const { roomId } = useParams();
//   const userId = uuidv4(); // ideally should be current user's ID

//   const { clients, provideMediaRef } = useWebRTC(roomId, userId);

//   return (
//     <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 text-white overflow-hidden">
//       {/* Video Area */}
//       <div className="flex-1 flex flex-wrap gap-4 p-4 justify-center items-center overflow-y-auto">
//         {clients.map((clientId) =>
//           clientId === userId ? (
//             <UserVideo
//               key={clientId}
//               provideMediaRef={provideMediaRef}
//               clientId={clientId}
//             />
//           ) : (
//             <RemoteVideo
//               key={clientId}
//               provideMediaRef={provideMediaRef}
//               clientId={clientId}
//             />
//           )
//         )}
//       </div>

//       {/* Sidebar */}
//       <div className="w-full md:w-[320px] bg-gray-800 border-l border-white/10 flex flex-col">
//         <Controls roomId={roomId} />
//         <ChatPanel roomId={roomId} userId={userId} />
//       </div>
//     </div>
//   );
// };

// export default MeetingRoom;
