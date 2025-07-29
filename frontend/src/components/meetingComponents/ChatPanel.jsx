import { useState, useEffect, useRef } from 'react';
import socket from '../../services/socket';

const ChatPanel = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Socket event handlers
  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages(prev => [...prev, {
        ...msg,
        isMe: msg.sender === userId
      }]);
    };

    const handleHistory = (history) => {
      setMessages(history.map(msg => ({
        ...msg,
        isMe: msg.sender === userId
      })));
    };

    socket.emit('join-chat', roomId);
    socket.on('receive-message', handleMessage);
    socket.on('message-history', handleHistory);

    return () => {
      socket.off('receive-message', handleMessage);
      socket.off('message-history', handleHistory);
    };
  }, [roomId, userId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('send-message', {
        roomId,
        sender: userId,
        text: input
      });
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.isMe ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>
              {!msg.isMe && (
                <div className="text-xs font-semibold text-gray-300">
                  {msg.sender.slice(0, 8)}...
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-xs mt-1 ${msg.isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-2 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white rounded px-3 py-2 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;

// import { useState, useEffect, useRef } from 'react';
// import socket from '../../services/socket';

// const ChatPanel = ({ roomId, userId }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Socket handlers
//   useEffect(() => {
//     socket.emit('join-chat', roomId);
    
//     const handleMessage = (msg) => {
//       setMessages(prev => [...prev, {
//         ...msg,
//         isMe: msg.sender === userId
//       }]);
//     };

//     socket.on('receive-message', handleMessage);

//     return () => {
//       socket.off('receive-message', handleMessage);
//     };
//   }, [roomId, userId]);

//   const sendMessage = () => {
//     if (input.trim()) {
//       socket.emit('send-message', {
//         roomId,
//         sender: userId,
//         text: input
//       });
//       setInput('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-3 space-y-2">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
//             <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.isMe ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>
//               <div className="whitespace-pre-wrap">{msg.text}</div>
//               <div className={`text-xs mt-1 ${msg.isMe ? 'text-blue-200' : 'text-gray-400'}`}>
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="p-2 border-t border-gray-700">
//         <div className="flex items-center gap-2">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyPress}
//             placeholder="Type a message..."
//             className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none"
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPanel;