import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function UserList() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role) {
      axios.get(`/api/users/${user.role}`).then((res) => {
        setUsers(res.data);
      });
    }
  }, [user]);
  return (
    <div>
      <h3>Available Users to Chat With</h3>
      {users.map((u) => (
        <div key={u._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/chat/${u._id}`)}>
          💬 {u.name}
        </div>
      ))}
    </div>
  );
}