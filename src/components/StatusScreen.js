import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, Copy, Share2, Users, DollarSign, Trophy, Calendar, Loader2 } from 'lucide-react';
import { apiCall, API_CONFIG } from '../config/api';
import { Link } from 'react-router-dom';

const StatusScreen = () => {
  const { currentUser } = useAuth();
  const [registrationStatus, setRegistrationStatus] = useState({
    status: 'pending',
    registrationId: '',
    registrationDate: '',
    paymentStatus: 'pending',
    referralCode: '',
    referralCount: 0,
    cashbackEligible: false,
    cashbackAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchRegistrationStatus();
    }
  }, [currentUser]);

  const fetchRegistrationStatus = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch tournaments to get registration status
      const tournamentsResponse = await apiCall(API_CONFIG.ENDPOINTS.TOURNAMENTS.GET_ALL);
      
      if (tournamentsResponse.success && tournamentsResponse.data.length > 0) {
        const activeTournament = tournamentsResponse.data[0];
        
        // Fetch user's registration status
        let userRegistration = null;
        try {
          const registrationResponse = await apiCall(
            API_CONFIG.ENDPOINTS.TOURNAMENTS.GET_REGISTRATIONS(activeTournament._id)
          );
          if (registrationResponse.success) {
            userRegistration = registrationResponse.data.find(
              reg => reg.userId === currentUser?._id
            );
          }
        } catch (error) {
          console.log('No registration found for user');
        }

        // Fetch user profile to get referral stats
        let userProfile = null;
        try {
          const profileResponse = await apiCall('/users/profile');
          if (profileResponse.success) {
            userProfile = profileResponse.data;
          }
        } catch (error) {
          console.log('Failed to fetch user profile');
        }

        setRegistrationStatus({
          status: userRegistration?.status || 'pending',
          registrationId: userRegistration?._id || 'TT2024-001',
          registrationDate: userRegistration?.createdAt ? new Date(userRegistration.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          paymentStatus: userRegistration?.paymentStatus || 'pending',
          referralCode: userProfile?.referralCode || 'REF123456',
          referralCount: userProfile?.referralCount || 0,
          cashbackEligible: userProfile?.cashbackEligible || false,
          cashbackAmount: userProfile?.cashbackAmount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching registration status:', error);
      setError('Failed to load registration status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(registrationStatus.referralCode);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareReferralCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Table Tennis Tournament Referral',
        text: `Join the table tennis tournament using my referral code: ${registrationStatus.referralCode}`,
        url: window.location.origin + '/register'
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyReferralCode();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
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
    switch (status) {
      case 'approved':
        return 'Registration Approved';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Registration Rejected';
      default:
        return 'Unknown Status';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <Loader2 className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your registration status...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You must be logged in to view your status.</p>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchRegistrationStatus}
          className="btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Status</h1>
        <p className="text-gray-600">Track your tournament registration and referral progress</p>
      </div>

      {/* Status Overview */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Registration Overview</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registrationStatus.status)}`}>
            {getStatusText(registrationStatus.status)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(registrationStatus.status)}
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-900">{getStatusText(registrationStatus.status)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">ID</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration ID</p>
                <p className="font-medium text-gray-900">{registrationStatus.registrationId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">$</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="font-medium text-gray-900 capitalize">{registrationStatus.paymentStatus}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="font-medium text-gray-900">{registrationStatus.registrationDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Referral Count</p>
                <p className="font-medium text-gray-900">{registrationStatus.referralCount}/30</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cashback Status</p>
                <p className="font-medium text-gray-900">
                  {registrationStatus.cashbackEligible ? 'Eligible' : 'Not Eligible'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Status</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">🏦</span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-blue-900">Payment Method</h4>
                <p className="text-blue-700">Manual Bank Transfer</p>
              </div>
            </div>
            <p className="text-sm text-blue-700">
              Your registration fee will be collected via bank transfer. Please ensure you've uploaded 
              the payment screenshot for verification.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-lg">📸</span>
              </div>
              <div>
                <h4 className="text-lg font-medium text-green-900">Payment Proof</h4>
                <p className="text-green-700 capitalize">{registrationStatus.paymentStatus}</p>
              </div>
            </div>
            {registrationStatus.paymentStatus === 'pending' ? (
              <div className="space-y-2">
                <p className="text-sm text-green-700">
                  Please upload a screenshot of your bank transfer confirmation.
                </p>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Upload Payment Proof →
                </button>
              </div>
            ) : (
              <p className="text-sm text-green-700">
                Payment proof uploaded successfully. Awaiting verification.
              </p>
            )}
          </div>
        </div>

        {registrationStatus.paymentStatus === 'pending' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xs">!</span>
                </div>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Payment Required</h4>
                <p className="text-sm text-yellow-700">
                  Your registration is incomplete until payment is verified. Please complete the bank transfer 
                  and upload the screenshot to proceed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Referral Code Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Referral Code</h2>
        
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Share this code with friends to earn cashback</p>
            <div className="bg-white border-2 border-primary-300 rounded-lg p-4 mb-4">
              <p className="text-3xl font-bold text-primary-600 font-mono">{registrationStatus.referralCode}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={copyReferralCode}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>{showCopied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={shareReferralCode}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Current Referrals</h4>
                <p className="text-2xl font-bold text-green-600">{registrationStatus.referralCount}</p>
                <p className="text-sm text-green-700">out of 30 required</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800">Potential Cashback</h4>
            <p className="text-2xl font-bold text-yellow-600">PKR {registrationStatus.referralCount >= 3 ? Math.min(150 + Math.round((registrationStatus.referralCount - 3) * (1500 - 150) / 27), 1500) : 0}</p>
            <p className="text-sm text-yellow-700">
              {registrationStatus.referralCount >= 3 
                ? `${Math.round((registrationStatus.referralCount - 3) / 27 * 100 + (150/1500)*100)}% of PKR 1500 registration fee`
                : 'Start referring to earn cashback!'
              }
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">How Referral Rewards Work</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Share your referral code with friends</li>
            <li>• When 3 people register using your code, you'll receive PKR 150 cashback</li>
            <li>• Cashback increases with each referral, up to PKR 1500 for 30 referrals</li>
            <li>• Cashback will be processed after tournament completion</li>
          </ul>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Referral Progress</h2>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to Cashback</span>
            <span>{Math.max(0, registrationStatus.referralCount - 3)}/27</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((Math.max(0, registrationStatus.referralCount - 3) / 27) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-9 gap-2">
          {[...Array(27)].map((_, index) => (
            <div
              key={index}
              className={`h-3 rounded ${
                index < Math.max(0, registrationStatus.referralCount - 3)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>

        <div className="mt-6 text-center">
          {registrationStatus.referralCount < 3 ? (
            <p className="text-gray-600">
              You need <span className="font-semibold text-primary-600">{3 - registrationStatus.referralCount}</span> more referral{3 - registrationStatus.referralCount !== 1 ? 's' : ''} to unlock cashback
            </p>
          ) : (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-semibold">Congratulations! You've unlocked cashback!</p>
              <p className="text-green-700 text-sm">Your PKR {Math.min(150 + Math.round((registrationStatus.referralCount - 3) * (1500 - 150) / 27), 1500)} cashback will be processed after the tournament</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusScreen; 