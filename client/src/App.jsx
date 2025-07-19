import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import DashboardPage from './pages/DashboardPage';

function App() {
    // A simple check for user info in local storage to see if they are logged in.
    const userInfo = localStorage.getItem('userInfo');

    return (
        <Router>
            <Navbar />
            <main style={{ padding: '0 2rem' }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={!userInfo ? <AuthPage isLogin /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!userInfo ? <AuthPage /> : <Navigate to="/dashboard" />} />
                    <Route path="/payment/success" element={userInfo ? <PaymentSuccessPage /> : <Navigate to="/login" />} />
                    {/* Protected Route */}
                    <Route path="/dashboard" element={userInfo ? <DashboardPage /> : <Navigate to="/login" />} />
                    
                    {/* Redirect any other path to home */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;