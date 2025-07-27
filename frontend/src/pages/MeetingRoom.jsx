import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import UserVideo from "../components/meetingComponents/UserVideo";
import RemoteVideo from "../components/meetingComponents/RemoteVideo";
import ChatPanel from "../components/meetingComponents/ChatPanel";
import Controls from "../components/meetingComponents/Controls";
import useWebRTC from "../hooks/UseWebRTC";

const MeetingRoom = () => {
  const { roomId } = useParams();
  const userId = uuidv4(); // ideally should be current user's ID

  const { clients, provideMediaRef } = useWebRTC(roomId, userId);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 text-white overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 flex flex-wrap gap-4 p-4 justify-center items-center overflow-y-auto">
        {clients.map((clientId) =>
          clientId === userId ? (
            <UserVideo
              key={clientId}
              provideMediaRef={provideMediaRef}
              clientId={clientId}
            />
          ) : (
            <RemoteVideo
              key={clientId}
              provideMediaRef={provideMediaRef}
              clientId={clientId}
            />
          )
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-[320px] bg-gray-800 border-l border-white/10 flex flex-col">
        <Controls roomId={roomId} />
        <ChatPanel roomId={roomId} userId={userId} />
      </div>
    </div>
  );
};

export default MeetingRoom;
