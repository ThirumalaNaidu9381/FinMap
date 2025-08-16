// frontend/src/components/chat/UserList.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Use environment variable or fallback for local dev
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function UserList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${user?.role}`);
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    if (user?.role) {
      fetchUsers();
    }
  }, [user]);

  return (
    <div className="dashboard">
      <h2>Available Users to Chat With</h2>
      {users.length === 0 ? (
        <p>No users available</p>
      ) : (
        users.map((u) => (
          <div
            key={u._id}
            className="card"
            onClick={() => navigate(`/chat/${u._id}`)}
            style={{ cursor: 'pointer' }}
          >
            {u.name}
          </div>
        ))
      )}
    </div>
  );
}
