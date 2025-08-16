import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function LoanRequestForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ amount: '', interestRate: '', duration: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post('/api/loans/request', {
        ...form,
        borrowerId: user._id
      });
      setMsg('✅ Loan request submitted successfully');
      setForm({ amount: '', interestRate: '', duration: '' }); // reset form
    } catch (err) {
      setMsg('❌ Failed to submit loan request');
    }
  };

  return (
    <div>
      <h2>Request a Loan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          value={form.amount}
          required
        />
        <br />
        <input
          type="number"
          name="interestRate"
          placeholder="Interest Rate (%)"
          onChange={handleChange}
          value={form.interestRate}
          required
        />
        <br />
        <input
          type="number"
          name="duration"
          placeholder="Duration (months)"
          onChange={handleChange}
          value={form.duration}
          required
        />
        <br />
        <button type="submit">Submit Request</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
