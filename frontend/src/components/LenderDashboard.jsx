import { useAuth } from '../../context/AuthContext';

export default function LenderDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome Lender {user?.name}</h2>
      <p>This is your lender dashboard.</p>
    </div>
  );
}