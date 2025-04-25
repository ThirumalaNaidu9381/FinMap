import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PendingLoans() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    axios.get('/api/loans/pending').then((res) => setLoans(res.data));
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(`/api/loans/${id}/${action}`);
      setLoans(loans.filter((l) => l._id !== id));
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  return (
    <div>
      <h2>Pending Loan Requests</h2>
      {loans.map((loan) => (
        <div key={loan._id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
          <p><strong>Amount:</strong> ₹{loan.amount}</p>
          <p><strong>Interest:</strong> {loan.interestRate}%</p>
          <p><strong>Duration:</strong> {loan.duration} months</p>
          <button onClick={() => handleAction(loan._id, 'approve')}>Approve</button>
          <button onClick={() => handleAction(loan._id, 'reject')} style={{ marginLeft: '10px' }}>Reject</button>
        </div>
      ))}
    </div>
  );
}
