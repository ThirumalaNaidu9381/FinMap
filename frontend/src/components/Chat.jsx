import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const socket = io('http://localhost:5000'); // backend socket server

export default function Chat() {
  const { user } = useAuth();
  const { partnerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Join socket room and load history
  useEffect(() => {
    if (!user?._id || !partnerId) return;

    socket.emit('join', user._id);

    // Fetch old messages
    axios.get(`/api/messages/${user._id}/${partnerId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Failed to load messages:', err));

    // Listen for new messages
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
    if (!text.trim()) return;

    const message = {
      senderId: user._id,
      receiverId: partnerId,
      text
    };

    socket.emit('send-message', message);
    setText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.chatWrapper}>
      <h3>Chat</h3>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.senderId === user._id ? 'flex-end' : 'flex-start',
              backgroundColor: msg.senderId === user._id ? '#dcf8c6' : '#f1f0f0'
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatWrapper: {
    width: '100%',
    maxWidth: '600px',
    margin: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  chatBox: {
    height: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid #ccc',
    padding: '10px',
    background: '#fff',
    borderRadius: '8px'
  },
  message: {
    padding: '8px 12px',
    borderRadius: '20px',
    maxWidth: '75%',
    fontSize: '14px'
  },
  inputRow: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flexGrow: 1,
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none'
  }
};