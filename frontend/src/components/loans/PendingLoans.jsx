import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PendingLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get('/api/loans/pending');
        setLoans(res.data);
      } catch (err) {
        console.error('Failed to fetch pending loans', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(`/api/loans/${id}/${action}`);
      setLoans((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error(`Failed to ${action} loan`, err);
    }
  };

  if (loading) return <p>Loading pending loans...</p>;

  return (
    <div>
      <h2>Pending Loan Requests</h2>
      {loans.length === 0 ? (
        <p>No pending loan requests</p>
      ) : (
        loans.map((loan) => (
          <div
            key={loan._id}
            style={{
              border: '1px solid #ccc',
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '4px'
            }}
          >
            <p><strong>Amount:</strong> ₹{loan.amount}</p>
            <p><strong>Interest:</strong> {loan.interestRate}%</p>
            <p><strong>Duration:</strong> {loan.duration} months</p>
            <button onClick={() => handleAction(loan._id, 'approve')}>
              Approve
            </button>
            <button
              onClick={() => handleAction(loan._id, 'reject')}
              style={{ marginLeft: '10px', backgroundColor: '#dc3545', color: 'white' }}
            >
              Reject
            </button>
          </div>
        ))
      )}
    </div>
  );
}
