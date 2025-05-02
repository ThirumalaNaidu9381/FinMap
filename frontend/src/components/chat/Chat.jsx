import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function Chat() {
  const { user } = useAuth();
  const { partnerId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:5000');
    newSocket.emit('join', user._id);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    if (!user || !partnerId) return;

    axios
      .get(`/api/messages/${user._id}/${partnerId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Failed to fetch messages', err));
  }, [user, partnerId]);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  const sendMessage = () => {
    if (text.trim() && socket) {
      socket.emit('send-message', {
        senderId: user._id,
        receiverId: partnerId,
        text,
      });
      setText('');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ padding: '5px', background: m.senderId === user._id ? '#e0ffe0' : '#f0f0f0' }}>
            {m.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
