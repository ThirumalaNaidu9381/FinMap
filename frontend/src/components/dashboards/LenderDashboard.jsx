import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LenderDashboard() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    axios.get('/api/loans/lender').then((res) => setLoans(res.data));
  }, []);
  
  useEffect(() => {
    axios.get(`/api/loans/lender?lenderId=${user._id}`).then((res) => setLoans(res.data));
  }, [user]);
  
  return (
    <div>
      <h2>Welcome Lender {user?.name}</h2>
      <p>This is your lender dashboard.</p>
      <h4>Approved/Rejected Loans</h4>
      <ul>
        {loans.map((loan) => (
          <li key={loan._id}>
            ₹{loan.amount} @ {loan.interestRate}% for {loan.duration} months — <strong>{loan.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
