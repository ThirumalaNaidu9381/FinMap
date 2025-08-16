import React from 'react';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>
        Welcome {user?.name ?? 'Guest'} {user?.role && `(${user.role})`}
      </h2>
      <button
        onClick={logout}
        style={{
          padding: '8px 16px',
          marginTop: '10px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
}
