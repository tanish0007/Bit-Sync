import { useEffect, useState } from 'react';
import socket from '../../socket'; // adjust path as needed

const ChatPanel = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.connect();

    socket.emit('join-room-chat', roomId);

    socket.on('receive-message', ({ sender, text }) => {
      setMessages((prev) => [...prev, { sender, text }]);
    });

    return () => {
      socket.emit('leave-room-chat', roomId);
      socket.off('receive-message');
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('send-message', { roomId, sender: userId, text: input });
      setMessages((prev) => [...prev, { sender: 'You', text: input }]);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-2">
      <div className="flex-1 overflow-y-auto space-y-2 p-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-semibold">{msg.sender.slice(0, 6)}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex p-1 border-t border-white/10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-gray-700 rounded-l px-2 py-1 text-white outline-none"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-1 rounded-r text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;