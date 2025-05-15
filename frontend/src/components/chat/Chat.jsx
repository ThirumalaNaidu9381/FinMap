import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const socket = io('http://localhost:5000');

export default function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${conversationId}`);
        setMessages(res.data);
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    if (conversationId) {
      fetchMessages();
      socket.emit('join-conversation', conversationId);
    }

    return () => {
      socket.emit('leave-conversation', conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    };

    socket.on('new-message', handleNewMessage);
    return () => socket.off('new-message', handleNewMessage);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMessage = {
      conversationId,
      senderId: user._id,
      text,
    };

    try {
      await axios.post('/api/messages', newMessage);
      socket.emit('send-message', newMessage);
      setText('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">Chat</div>
      <div className="chat-messages" ref={chatRef}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`bubble ${msg.senderId === user._id ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
