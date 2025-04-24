import { useAuth } from '../../context/AuthContext';

export default function BorrowerDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Welcome Borrower {user?.name}</h2>
      <p>This is your borrower dashboard.</p>
    </div>
  );
}