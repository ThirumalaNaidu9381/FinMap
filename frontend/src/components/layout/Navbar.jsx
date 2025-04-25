import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
      {!user && (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
        </>
      )}
      {user && (
        <>
          <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
          <Link to="/users" style={{ marginRight: '10px' }}>Chat</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}