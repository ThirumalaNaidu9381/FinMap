import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false); // ensure menu closes on logout
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo" onClick={closeMenu}>FinMap</Link>
        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      <div className={`navbar-links ${open ? 'open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
            <Link to="/interests" onClick={closeMenu}>Interests</Link>
            <Link to="/users" onClick={closeMenu}>Users</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </div>

      {user && <span className="user-name">{user.name || 'User'}</span>}
    </nav>
  );
}
