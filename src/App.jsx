import {Routes,Route,Link,Navigate} from 'react-router-dom';
// import { useState } from 'react'
// import './App.css'
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm .jsx';
export default function App() {
  return (
    <div style={{padding:'20px'}}>
      <nav style={{marginBottom:'20px'}}>
        <Link to="/login" style={{marginRight:'10px'}}>Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm/>} />
      </Routes>
    </div>
  );
}