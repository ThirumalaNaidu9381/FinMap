import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function LoanRequestForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({ amount: '', interestRate: '', duration: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/loans/request', { ...form, borrowerId: user._id });
      setMsg('Loan request submitted successfully');
    } catch (err) {
      setMsg('Failed to submit loan request');
    }
  };

  return (
    <div>
      <h2>Request a Loan</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="amount" placeholder="Amount" onChange={handleChange} value={form.amount} /><br />
        <input type="number" name="interestRate" placeholder="Interest %" onChange={handleChange} value={form.interestRate} /><br />
        <input type="number" name="duration" placeholder="Duration (months)" onChange={handleChange} value={form.duration} /><br />
        <input type="number" name="interestRate" placeholder="Interest Rate (%)" value={form.interestRate} onChange={handleChange} required/><br />

        <button type="submit">Submit Request</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
