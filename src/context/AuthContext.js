import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall, API_CONFIG } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        setIsAdmin(userData.isAdmin || false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.USERS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      console.log('Login response:', response); // Debug log

      if (response.success) {
        console.log('Response structure:', response);
        
        // Handle different response structures
        let userData, token;
        
        if (response.data) {
          // Standard response structure with data wrapper
          userData = response.data;
          token = response.data.token;
        } else if (response.token) {
          // Direct response structure without data wrapper
          userData = response;
          token = response.token;
        } else {
          console.error('Unexpected response structure:', response);
          return { success: false, message: 'Invalid response format from server' };
        }
        
        // Extract user data with fallbacks
        const { 
          _id, 
          email: userEmail, 
          firstName, 
          lastName, 
          registrationId, 
          referralCode, 
          isAdmin 
        } = userData;
        
        // Validate required fields
        if (!_id || !userEmail) {
          console.error('Missing required user fields:', userData);
          return { success: false, message: 'Invalid user data received from server' };
        }
        
        // Create user object without sensitive data
        const user = {
          _id,
          email: userEmail,
          firstName: firstName || '',
          lastName: lastName || '',
          registrationId: registrationId || '',
          referralCode: referralCode || '',
          isAdmin: isAdmin || false
        };
        
        console.log('Extracted user data:', user); // Debug log
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setCurrentUser(user);
        setIsAdmin(isAdmin || false);
        
        return { success: true, isAdmin: isAdmin || false };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.USERS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        return { success: true, message: response.message || 'Registration successful' };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      if (response.success) {
        const updatedUser = { ...currentUser, ...profileData };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, message: response.message || 'Profile updated successfully' };
      } else {
        return { success: false, message: response.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'Profile update failed' };
    }
  };

  const value = {
    currentUser,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 