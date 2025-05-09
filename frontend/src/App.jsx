import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import LenderDashboard from './components/dashboards/LenderDashboard';
import BorrowerDashboard from './components/dashboards/BorrowerDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import RedirectBasedOnRole from './routes/RedirectBasedOnRole';
import UserList from './components/chat/UserList';
import Chat from './components/chat/Chat';
import Navbar from './components/layout/Navbar';
import LoanRequestForm from './components/loans/LoanRequestForm';
import PendingLoans from './components/loans/PendingLoans';
import Interests from './components/Interests';
import './App.css';

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RedirectBasedOnRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lender-dashboard"
          element={
            <ProtectedRoute>
              <LenderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrower-dashboard"
          element={
            <ProtectedRoute>
              <BorrowerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:partnerId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pending-loans"
          element={
            <ProtectedRoute>
              <PendingLoans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-loan"
          element={
            <ProtectedRoute>
              <LoanRequestForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interests"
          element={
            <ProtectedRoute>
              <Interests />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
