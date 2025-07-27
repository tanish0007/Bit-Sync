import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

const Controls = ({ roomId }) => {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);

  const toggleMic = () => {
    setMic((prev) => !prev);
    // TODO: mute/unmute mic in stream
  };

  const toggleCamera = () => {
    setCamera((prev) => !prev);
    // TODO: enable/disable video track
  };

  const leaveCall = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex justify-around p-4 border-b border-white/10">
      <button onClick={toggleMic} className="p-2 bg-gray-700 rounded-full">
        {mic ? <Mic className="text-green-400" /> : <MicOff className="text-red-400" />}
      </button>
      <button onClick={toggleCamera} className="p-2 bg-gray-700 rounded-full">
        {camera ? <Video className="text-green-400" /> : <VideoOff className="text-red-400" />}
      </button>
      <button onClick={leaveCall} className="p-2 bg-red-600 rounded-full">
        <PhoneOff />
      </button>
    </div>
  );
};

export default Controls;
