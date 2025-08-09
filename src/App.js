import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import RegistrationForm from './components/RegistrationForm';
import StatusScreen from './components/StatusScreen';
import AdminPortal from './components/AdminPortal';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import TournamentSchedule from './components/TournamentSchedule';
import Rules from './components/Rules';
import ReferralStats from './components/ReferralStats';
import ReferralLink from './components/ReferralLink';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/status" element={
                <ProtectedRoute>
                  <StatusScreen />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPortal />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/schedule" element={<TournamentSchedule />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/referrals" element={
                <ProtectedRoute>
                  <ReferralStats />
                </ProtectedRoute>
              } />
              <Route path="/referral/:referralCode" element={<ReferralLink />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 