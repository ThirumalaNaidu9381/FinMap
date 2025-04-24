import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'lender' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'lender') navigate('/lender-dashboard');
      else if (user.role === 'borrower') navigate('/borrower-dashboard');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      const { token, user } = res.data;
      login(user, token);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} value={formData.name} /><br />
        <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} /><br />
        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="lender">Lender</option>
          <option value="borrower">Borrower</option>
        </select><br />
        <button type="submit">Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
