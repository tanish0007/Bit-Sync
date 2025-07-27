import { useEffect, useRef, useState } from 'react';

const UserVideoBox = () => {
  const videoRef = useRef(null);
  const [streamError, setStreamError] = useState(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
        setStreamError("Unable to access camera. Please allow permissions.");
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      {streamError ? (
        <p className="text-red-500 text-sm">{streamError}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="rounded-xl border w-full h-auto object-cover"
        />
      )}
    </div>
  );
};

export default UserVideoBox;
