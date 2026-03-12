import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simple test components
const Home = () => <div style={{ padding: '20px', textAlign: 'center' }}><h1>🚀 CommerceHub is Working!</h1><p>Your Vercel deployment is successful.</p></div>;
const Login = () => <div style={{ padding: '20px', textAlign: 'center' }}><h1>Login Page</h1><p>Simple login page for testing.</p></div>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
