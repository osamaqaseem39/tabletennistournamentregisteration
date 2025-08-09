import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Download,
  Trophy,
  RefreshCw
} from 'lucide-react';
import { apiCall, API_CONFIG } from '../config/api';

const AdminPortal = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cashback');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Live data from API
  const [cashbackList, setCashbackList] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalCashback: 0,
    pendingCashback: 0,
    approvedCashback: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(API_CONFIG.ENDPOINTS.USERS.GET_ALL);
      
      if (response.success) {
        const users = response.data || [];
        setRegistrations(users.map(user => ({
          id: user._id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
          email: user.email,
          status: user.registrationStatus || 'pending',
          paymentStatus: user.paymentStatus || 'pending',
          registrationDate: new Date(user.createdAt).toLocaleDateString(),
          referralCode: user.referralCode || 'N/A'
        })));

        // Calculate cashback data
        const cashbackUsers = users.filter(user => user.referralCount >= 3);
        setCashbackList(cashbackUsers.map(user => ({
          id: user._id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A',
          email: user.email,
          accountNumber: user.accountNumber || 'N/A',
          bankName: user.bankName || 'N/A',
          referralCount: user.referralCount || 0,
          cashbackAmount: user.referralCount >= 3 ? 1500 : 0,
          status: user.cashbackStatus || 'pending',
          registrationDate: new Date(user.createdAt).toLocaleDateString(),
          referralCode: user.referralCode || 'N/A'
        })));

        // Update stats
        setStats({
          totalRegistrations: users.length,
          totalCashback: cashbackUsers.length * 1500,
          pendingCashback: cashbackUsers.filter(u => u.cashbackStatus === 'pending').length * 1500,
          approvedCashback: cashbackUsers.filter(u => u.cashbackStatus === 'approved').length * 1500
        });
        
        // Set last updated timestamp
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchUsers();
  };

  const updateUserStatus = async (userId, field, value) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(userId));
      const response = await apiCall(API_CONFIG.ENDPOINTS.USERS.UPDATE_STATUS(userId), {
        method: 'PUT',
        body: JSON.stringify({ [field]: value })
      });

      if (response.success) {
        // Refresh data after successful update
        await fetchUsers();
        setError(null); // Clear any previous errors
        setSuccessMessage('User status updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide after 3 seconds
      } else {
        setError('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const updatePaymentStatus = async (userId, status) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(userId));
      const response = await apiCall(API_CONFIG.ENDPOINTS.USERS.UPDATE_STATUS(userId), {
        method: 'PUT',
        body: JSON.stringify({ paymentStatus: status })
      });

      if (response.success) {
        // Refresh data after successful update
        await fetchUsers();
        setError(null); // Clear any previous errors
        setSuccessMessage('Payment status updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide after 3 seconds
      } else {
        setError('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const updateRegistrationStatus = async (userId, status) => {
    try {
      setUpdatingItems(prev => new Set(prev).add(userId));
      const response = await apiCall(API_CONFIG.ENDPOINTS.USERS.UPDATE_STATUS(userId), {
        method: 'PUT',
        body: JSON.stringify({ registrationStatus: status })
      });

      if (response.success) {
        // Refresh data after successful update
        await fetchUsers();
        setError(null); // Clear any previous errors
        setSuccessMessage('Registration status updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000); // Auto-hide after 3 seconds
      } else {
        setError('Failed to update registration status');
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      setError('Failed to update registration status');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Filter data based on search and status
  const filteredCashbackList = cashbackList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.referralCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredRegistrations = registrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.referralCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    } else {
      fetchUsers();
      
      // Set up auto-refresh every 30 seconds for real-time updates
      const interval = setInterval(fetchUsers, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'processed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'processed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };



  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-yellow-100 p-3 rounded-full">
          <Shield className="h-8 w-8 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600">Manage tournament registrations and cashback processing</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={refreshData}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Cashback</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {stats.totalCashback}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-500">Pending Cashback</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {stats.pendingCashback}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Approved Cashback</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {stats.approvedCashback}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('cashback')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cashback'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cashback Management
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registrations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Registrations
          </button>
          <button
            onClick={() => setActiveTab('brackets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'brackets'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Trophy className="h-4 w-4 inline mr-2" />
            Tournament Brackets
          </button>
        </nav>
      </div>

      {/* Cashback Management Tab */}
      {activeTab === 'cashback' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Cashback List</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="processed">Processed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referral Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cashback Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                          <p className="text-gray-500">Loading data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCashbackList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Users className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">No cashback eligible users found</p>
                          <p className="text-sm text-gray-400">Users need at least 3 referrals to be eligible for cashback</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCashbackList.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.referralCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.referralCount}/30</div>
                          <div className="text-sm text-gray-500">
                            {item.referralCount >= 3 ? 'Eligible' : 'Not Eligible'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Rs. {item.cashbackAmount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{item.bankName}</div>
                            <div className="text-sm text-gray-500">{item.accountNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </div>
                        </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateUserStatus(item.id, 'cashbackStatus', 'approved')}
                            disabled={updatingItems.has(item.id) || item.status === 'approved'}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve Cashback"
                          >
                            {updatingItems.has(item.id) ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => updateUserStatus(item.id, 'cashbackStatus', 'rejected')}
                            disabled={updatingItems.has(item.id) || item.status === 'rejected'}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject Cashback"
                          >
                            {updatingItems.has(item.id) ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">All Registrations</h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referral Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                          <p className="text-gray-500">Loading data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Users className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">No registrations found</p>
                          <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.registrationDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.referralCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.paymentStatus === 'confirmed' 
                              ? 'text-green-600 bg-green-100' 
                              : 'text-yellow-600 bg-yellow-100'
                          }`}>
                            {getStatusText(item.paymentStatus)}
                          </span>
                        </td>
                                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateRegistrationStatus(item.id, 'approved')}
                            disabled={updatingItems.has(item.id) || item.status === 'approved'}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve Registration"
                          >
                            {updatingItems.has(item.id) ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => updateRegistrationStatus(item.id, 'rejected')}
                            disabled={updatingItems.has(item.id) || item.status === 'rejected'}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject Registration"
                          >
                            {updatingItems.has(item.id) ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => updatePaymentStatus(item.id, 'confirmed')}
                            disabled={updatingItems.has(item.id) || item.paymentStatus === 'confirmed'}
                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Confirm Payment"
                          >
                            {updatingItems.has(item.id) ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <DollarSign className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal; 