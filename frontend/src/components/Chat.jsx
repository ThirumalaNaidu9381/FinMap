import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
const socket = io('http://localhost:5000');
export default function Chat({ partnerId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (!user) return;
    socket.emit('join', user._id);
    axios.get(`/api/messages/${user._id}/${partnerId}`).then((res) => {
      setMessages(res.data);
    });
    socket.on('receive-message', (msg) => {
      if (
        (msg.senderId === user._id && msg.receiverId === partnerId) ||
        (msg.senderId === partnerId && msg.receiverId === user._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off('receive-message');
  }, [user, partnerId]);
  const handleSend = () => {
    if (text.trim()) {
      socket.emit('send-message', {
        senderId: user._id,
        receiverId: partnerId,
        text
      });
      setText('');
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
      {messages.map((m, idx) => (
        <div key={idx} style={{ textAlign: m.senderId === user._id ? 'right' : 'left' }}>
          <p style={{ margin: '5px 0' }}>{m.text}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
