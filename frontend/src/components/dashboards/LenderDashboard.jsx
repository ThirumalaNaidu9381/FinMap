import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LenderDashboard() {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          axios.get('/api/loans/pending'),
          axios.get('/api/loans/approved')
        ]);
        setPendingLoans(pendingRes.data);
        setApprovedLoans(approvedRes.data);
      } catch (err) {
        console.error('Failed to fetch loans', err);
      }
    };

    fetchLoans();
  }, []);

  const approveLoan = async (id) => {
    try {
      await axios.put(`/api/loans/${id}/approve`);
      setPendingLoans(pendingLoans.filter((loan) => loan._id !== id));
      const approvedLoan = pendingLoans.find((loan) => loan._id === id);
      if (approvedLoan) {
        setApprovedLoans([...approvedLoans, { ...approvedLoan, status: 'approved' }]);
      }
    } catch (err) {
      console.error('Failed to approve loan', err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Pending Loan Requests</h2>
      {pendingLoans.length === 0 ? (
        <p>No pending loan requests</p>
      ) : (
        pendingLoans.map((loan) => (
          <div key={loan._id} className="card">
            <p><strong>Borrower:</strong> {loan.borrowerId?.name}</p>
            <p><strong>Amount:</strong> ₹{loan.amount}</p>
            <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
            <button onClick={() => approveLoan(loan._id)}>Approve</button>
          </div>
        ))
      )}

      <h2 style={{ marginTop: '2rem' }}>Approved Loans</h2>
      {approvedLoans.length === 0 ? (
        <p>No approved loans yet</p>
      ) : (
        approvedLoans.map((loan) => (
          <div key={loan._id} className="card">
            <p><strong>Borrower:</strong> {loan.borrowerId?.name}</p>
            <p><strong>Amount:</strong> ₹{loan.amount}</p>
            <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
            <p><strong>Status:</strong> Approved</p>
          </div>
        ))
      )}
    </div>
  );
}
