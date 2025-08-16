import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/BorrowerDashboard.css';

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState('');
  const [loans, setLoans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Fetch borrower's loans
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(`/api/loans/borrower/${user._id}`);
        setLoans(res.data);
      } catch (err) {
        console.error('Failed to fetch loans', err.response?.data?.message || err.message);
      }
    };

    if (user && user._id) {
      fetchLoans();
    }
  }, [user]);

  // Handle loan request form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    try {
      const res = await axios.post('/api/loans', {
        amount,
        interestRate,
        borrowerId: user._id,
        phone,
      });

      if (res.status === 201) {
        setSuccess('Loan requested successfully!');
        setAmount('');
        setInterestRate('');
        setPhone('');
        setShowForm(false);
        setLoans((prev) => [...prev, res.data]); // Optimistic UI update
      }
    } catch (err) {
      console.error('Loan request failed', err.response?.data?.message || err.message);
    }
  };

  // Navigate to chat with lender
  const handleChat = (lenderId) => {
    if (lenderId) {
      navigate(`/users?lenderId=${lenderId}`);
    }
  };

  return (
    <div className="dashboard">
      <h2>Borrower Dashboard</h2>

      <button
        onClick={() => setShowForm((prev) => !prev)}
        className="toggle-btn"
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
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number for SMS"
            required
          />
          <button type="submit">Submit Request</button>
        </form>
      )}

      {success && <p className="success-text">{success}</p>}

      <h2 style={{ marginTop: '2rem' }}>Your Loans</h2>
      {loans.length === 0 ? (
        <p>No loan records yet</p>
      ) : (
        loans.map((loan) => (
          <div key={loan._id} className="card">
            <p><strong>Amount:</strong> ₹{loan.amount}</p>
            <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
            <p><strong>Status:</strong> {loan.status}</p>

            {loan.status === 'approved' && (
              <>
                <p><strong>Approval Date:</strong> {new Date(loan.updatedAt).toLocaleDateString()}</p>
                <p><strong>Interest Due Date:</strong> {loan.nextInterestDueDate ? new Date(loan.nextInterestDueDate).toLocaleDateString() : 'N/A'}</p>
              </>
            )}

            {loan.status === 'rejected' && loan.rejectionReason && (
              <>
                <p className="error-text">
                  <strong>Rejection Reason:</strong> {loan.rejectionReason}
                </p>
                <p style={{ fontStyle: 'italic' }}>
                  Rejected by:{' '}
                  {typeof loan.rejectedBy === 'object' && loan.rejectedBy?.name
                    ? loan.rejectedBy.name
                    : typeof loan.rejectedBy === 'string'
                    ? `User ID: ${loan.rejectedBy}`
                    : 'Unknown'}
                </p>
                {loan.rejectedBy && (
                  <button
                    onClick={() =>
                      handleChat(
                        typeof loan.rejectedBy === 'object'
                          ? loan.rejectedBy._id
                          : loan.rejectedBy
                      )
                    }
                    className="chat-btn"
                  >
                    Chat with Lender
                  </button>
                )}
              </>
            )}

            <p><strong>Phone:</strong> {loan.phone}</p>
          </div>
        ))
      )}
    </div>
  );
}
