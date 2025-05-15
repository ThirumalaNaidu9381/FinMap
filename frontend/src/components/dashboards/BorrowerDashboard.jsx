import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [success, setSuccess] = useState('');
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchApprovedLoans = async () => {
      try {
        const res = await axios.get(`/api/loans/approved/${user._id}`);
        setApprovedLoans(res.data);
      } catch (err) {
        console.error('Failed to fetch approved loans');
      }
    };

    if (user?._id) {
      fetchApprovedLoans();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      const res = await axios.post('/api/loans', {
        amount,
        interestRate,
        borrowerId: user._id
      });
      if (res.status === 201) {
        setSuccess('Loan requested successfully!');
        setAmount('');
        setInterestRate('');
        setShowForm(false);
      }
    } catch (err) {
      console.error('Loan request failed');
    }
  };

  return (
    <div className="dashboard">
      <h2>Borrower Dashboard</h2>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        style={{
          padding: '0.6rem 1rem',
          marginBottom: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        {showForm ? 'Cancel' : 'Add New Request'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="Interest rate (%)"
            required
          />
          <button type="submit">Submit Request</button>
        </form>
      )}

      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h2 style={{ marginTop: '2rem' }}>Your Approved Loans</h2>
      {approvedLoans.length === 0 ? (
        <p>No approved loans yet</p>
      ) : (
        approvedLoans.map((loan) => (
          <div key={loan._id} className="card">
            <p><strong>Amount:</strong> ₹{loan.amount}</p>
            <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
            <p><strong>Status:</strong> Approved</p>
          </div>
        ))
      )}
    </div>
  );
}
