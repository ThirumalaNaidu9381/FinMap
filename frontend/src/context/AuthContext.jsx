// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?._id && parsedUser?.email) {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          throw new Error('Malformed user object');
        }
      }
    } catch (err) {
      console.error('❌ Failed to load auth from localStorage:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, []);

  const login = ({ user: userData, token: authToken }) => {
    if (!userData?._id || !authToken) {
      console.error('❌ Invalid login payload');
      return;
    }
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
