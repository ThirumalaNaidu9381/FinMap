import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    axios.get('/api/loans/borrower').then((res) => setLoans(res.data));
  }, []);
  
  useEffect(() => {
    axios.get(`/api/loans/borrower?borrowerId=${user._id}`).then((res) => setLoans(res.data));
  }, [user]);
  
  return (
    <div>
      <h2>Welcome Borrower {user?.name}</h2>
      <p>This is your borrower dashboard.</p>
      <h4>Your Loan Requests</h4>
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
