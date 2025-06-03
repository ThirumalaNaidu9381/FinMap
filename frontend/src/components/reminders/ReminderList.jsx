import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReminderList() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get('/api/loans/approved');
      const due = res.data.filter(loan => loan.nextReminderDate && new Date(loan.nextReminderDate) <= new Date());
      setReminders(due);
    };
    fetch();
  }, []);

  return (
    <div className="dashboard">
      <h2>Interest Reminders</h2>
      {reminders.map((loan) => (
        <div key={loan._id} className="card">
          <p>Borrower: {loan.borrowerId?.name}</p>
          <p>Amount: ₹{loan.amount}</p>
          <p>Interest: {loan.interestRate}%</p>
          <p>Due On: {new Date(loan.nextReminderDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
