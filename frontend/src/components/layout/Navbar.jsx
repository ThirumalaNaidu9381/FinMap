import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import './Navbar.css'; // 🔁 Make sure to create this CSS file too

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">FinMap</Link>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
      <div className={`navbar-links ${open ? 'open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
            <Link to="/interests" onClick={() => setOpen(false)}>Interests</Link>
            <Link to="/users" onClick={() => setOpen(false)}>Users</Link>
            <button onClick={() => { handleLogout(); setOpen(false); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
          </>
        )}
      </div>
      {user && <span className="user-name">{user.name}</span>}
    </nav>
  );
}
