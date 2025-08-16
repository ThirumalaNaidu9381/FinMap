import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReminderList() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get('/api/loans/approved');

        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize date

        const due = res.data.filter(
          (loan) =>
            loan?.nextReminderDate &&
            new Date(loan.nextReminderDate) <= today
        );

        setReminders(due);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  if (loading) {
    return <p>Loading reminders...</p>;
  }

  return (
    <div className="dashboard">
      <h2>Interest Reminders</h2>
      {reminders.length > 0 ? (
        reminders.map((loan) => (
          <div key={loan?._id} className="card">
            <p>Borrower: {loan?.borrowerId?.name || 'N/A'}</p>
            <p>Amount: ₹{loan?.amount ?? 'N/A'}</p>
            <p>Interest: {loan?.interestRate ?? 'N/A'}%</p>
            <p>
              Due On:{' '}
              {loan?.nextReminderDate
                ? new Date(loan.nextReminderDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        ))
      ) : (
        <p>No reminders due today.</p>
      )}
    </div>
  );
}
