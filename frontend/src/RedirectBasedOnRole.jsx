import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
export default function RedirectBasedOnRole() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'lender') navigate('/lender-dashboard');
    else if (user?.role === 'borrower') navigate('/borrower-dashboard');
    else navigate('/login');
  }, [user]);
  return null; 
}
