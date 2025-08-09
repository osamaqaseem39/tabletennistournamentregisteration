import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, User, LogOut, Shield, Home, ClipboardList, Award } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
            <Gamepad2 className="h-8 w-8" />
            <span className="text-xl font-bold">TT Tournament</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-primary-600 transition-colors">
              Register
            </Link>
            {currentUser && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                <ClipboardList className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            {currentUser && (
              <Link to="/referrals" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Referrals</span>
              </Link>
            )}
            <Link to="/schedule" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>Schedule</span>
            </Link>
            <Link to="/rules" className="text-gray-700 hover:text-primary-600 transition-colors">
              Rules
            </Link>
            {currentUser && (
              <Link to="/status" className="text-gray-700 hover:text-primary-600 transition-colors">
                Status
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                Admin Portal
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  {isAdmin && <Shield className="h-5 w-5 text-yellow-600" />}
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="text-sm">{currentUser.email}</span>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 