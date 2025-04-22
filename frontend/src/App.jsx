// import {Routes,Route,Link,Navigate} from 'react-router-dom';
// import LoginForm from './components/LoginForm.jsx';
// import RegisterForm from './components/RegisterForm .jsx';
// import Dashboard from './components/Dashboard';
// import ProtectedRoute from './ProtectedRoute.jsx';
import LenderDashboard from './components/LenderDashboard';
import BorrowerDashboard from './components/BorrowerDashboard';
<Route
  path="/lender-dashboard"
    elements={
      <ProtectedRoute>
        <LenderDashboard/>
      </ProtectedRoute>
    }
/>
<Route
  path="/borrower-dashboard"
    elements={
      <ProtectedRoute>
        <BorrowerDashboard/>
      </ProtectedRoute>
    }
/>
<Route
  path="/dashboard"
    elements={
      <ProtectedRoute>
        <RedirectBasedOnRole/>
      </ProtectedRoute>
    }
/>





// export default function App() {
//   return (
//     <div style={{padding:'20px'}}>
//       <nav style={{marginBottom:'20px'}}>
//         <Link to="/login" style={{marginRight:'10px'}}>Login</Link>
//         <Link to="/register" style={{marginRight:'10px'}}>Register</Link>
//         <link to="/dashboard">Dashboard</link>
//       </nav>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/register" element={<RegisterForm/>} />
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard/>
//           </ProtectedRoute>
//           }
//           />
//       </Routes>
//     </div>
//   );
// }