const UserVideo = ({ clientId, provideMediaRef }) => {
  return (
    <div className="w-full h-full relative">
      <video
        ref={(instance) => provideMediaRef(clientId, instance)}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-60 py-1 text-center text-sm">
        You
      </div>
    </div>
  );
};

export default UserVideo;

// const UserVideo = ({ clientId, provideMediaRef }) => {
//   return (
//     <div className="w-[300px] h-[200px] bg-gray-700 rounded-xl overflow-hidden shadow">
//       <video
//         ref={(instance) => provideMediaRef(clientId, instance)}
//         autoPlay
//         muted
//         playsInline
//         className="w-full h-full object-cover"
//       />
//       <div className="text-center text-sm bg-gray-900 bg-opacity-60 py-1">{clientId.slice(0, 8)} (You)</div>
//     </div>
//   );
// };

// export default UserVideo;
