import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RedirectBasedOnRole() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'lender') navigate('/lender-dashboard');
    else if (user.role === 'borrower') navigate('/borrower-dashboard');
    else navigate('/login');
  }, [user, navigate]); // ✅ include navigate in dependencies

  return null;
}
