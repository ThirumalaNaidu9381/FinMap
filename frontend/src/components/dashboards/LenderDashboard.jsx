import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LenderDashboard.css';

export default function LenderDashboard() {
  const { user } = useAuth();
  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user?._id) return;
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          axios.get('/api/loans/pending', { params: { lenderId: user._id } }),
          axios.get(`/api/loans/lender/accepted/${user._id}`)
        ]);
        setPendingLoans(pendingRes.data);
        setApprovedLoans(approvedRes.data);
      } catch (err) {
        console.error('Failed to fetch loans', err);
      }
    };
    fetchLoans();
  }, [user]);

  const approveLoan = async (id) => {
    try {
      const res = await axios.put(`/api/loans/${id}/approve`);
      setPendingLoans(pendingLoans.filter((loan) => loan._id !== id));
      setApprovedLoans((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to approve loan', err);
    }
  };

  const rejectLoan = async (id) => {
    const reason = rejectionReasons[id]?.trim();
    if (!reason) return alert('Please enter a rejection reason.');
    if (!user || !user._id) return alert('User not logged in');

    try {
      await axios.put(`/api/loans/${id}/reject`, {
        reason,
        lenderId: user._id
      });
      setPendingLoans(pendingLoans.filter((loan) => loan._id !== id));
      const updatedReasons = { ...rejectionReasons };
      delete updatedReasons[id];
      setRejectionReasons(updatedReasons);
    } catch (err) {
      console.error('Failed to reject loan', err);
    }
  };

  const sendReminder = async (loanId) => {
    try {
      const res = await axios.post(`/api/reminders/send/${loanId}`);
      alert(res.data.message || 'Reminder sent');
    } catch (err) {
      alert('Failed to send reminder');
    }
  };

  return (
    <div className="dashboard">
      <h2>Pending or Rejected Loan Requests</h2>
      {pendingLoans.length === 0 ? (
        <p>No pending loan requests</p>
      ) : (
        pendingLoans.map((loan) => (
          <div key={loan._id} className="card">
            <p><strong>Borrower:</strong> {loan.borrowerId?.name}</p>
            <p><strong>Amount:</strong> ₹{loan.amount}</p>
            <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
            <p><strong>Status:</strong> {loan.status}</p>

            {loan.status === 'rejected' && loan.rejectedBy?._id === user._id && (
              <p style={{ color: 'red' }}>
                <strong>Rejection Reason:</strong> {loan.rejectionReason}
              </p>
            )}

            {(loan.status === 'pending' || loan.rejectedBy?._id !== user._id) && (
              <>
                <button onClick={() => approveLoan(loan._id)} style={{ marginRight: '0.5rem' }}>
                  Approve
                </button>
                <input
                  type="text"
                  placeholder="Rejection reason"
                  value={rejectionReasons[loan._id] || ''}
                  onChange={(e) =>
                    setRejectionReasons({ ...rejectionReasons, [loan._id]: e.target.value })
                  }
                  style={{ width: '60%', margin: '0.5rem 0' }}
                />
                <button
                  onClick={() => rejectLoan(loan._id)}
                  style={{ backgroundColor: '#dc3545', color: '#fff' }}
                >
                  Reject
                </button>
              </>
            )}
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
            <p><strong>Approval Date:</strong> {new Date(loan.updatedAt).toLocaleDateString()}</p>
            <p><strong>Interest Due Date:</strong> {loan.nextInterestDueDate ? new Date(loan.nextInterestDueDate).toLocaleDateString() : 'Not set'}</p>
            <p><strong>Reminder Date:</strong> {loan.nextReminderDate ? new Date(loan.nextReminderDate).toLocaleDateString() : 'Not set'}</p>
            <button
              onClick={() => sendReminder(loan._id)}
              style={{
                backgroundColor: '#ffc107',
                color: '#000',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                marginTop: '0.5rem',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Send Reminder
            </button>
          </div>
        ))
      )}
    </div>
  );
}
