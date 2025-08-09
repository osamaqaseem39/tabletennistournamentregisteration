import React, { useState, useEffect } from 'react';
import { Gift, Users, DollarSign, CheckCircle, Clock, Copy, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../config/api';

const ReferralStats = () => {
  const { currentUser } = useAuth();
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/users/referral-stats', 'GET');
      
      if (response.success) {
        setReferralStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch referral stats');
      }
    } catch (error) {
      setError('Failed to fetch referral statistics');
    } finally {
      setLoading(false);
    }       
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/referral/${referralStats.referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = async () => {
    const referralLink = `${window.location.origin}/referral/${referralStats.referralCode}`;
    const shareData = {
      title: 'Join Table Tennis Tournament 2024',
      text: `I've been invited to join the Table Tennis Tournament 2024! Use my referral code ${referralStats.referralCode} to get PKR 50 off your registration fee.`,
      url: referralLink
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      copyReferralLink();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading referral statistics...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <p className="text-red-600">You must be logged in to view referral statistics.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchReferralStats}
          className="mt-2 text-primary-600 hover:text-primary-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!referralStats) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Floating Notification */}
      {copied && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Referral link copied to clipboard!</span>
          </div>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Statistics</h1>
        <p className="text-gray-600">Track your referrals and earnings</p>
      </div>

      {/* Referral Code Section */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Referral Code</h2>
            <p className="text-gray-600 mb-4">Share this code with friends to earn rewards</p>
          </div>
          <div className="text-right">
            <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
              <p className="text-sm text-primary-600 font-medium">Referral Code</p>
              <p className="text-2xl font-bold text-primary-700 font-mono">
                {referralStats.referralCode}
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={copyReferralLink}
            className={`btn-primary flex items-center justify-center ${
              copied ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Referral Link
              </>
            )}
          </button>
          
          <button
            onClick={shareReferralLink}
            className="btn-secondary flex items-center justify-center"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </button>
        </div>
        
        {/* Referral Link Display */}
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Your referral link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={`${window.location.origin}/referral/${referralStats.referralCode}`}
              readOnly
              className="flex-1 p-2 text-sm bg-white border border-gray-300 rounded-md font-mono"
            />
            <button
              onClick={copyReferralLink}
              className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Gift className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              <span className="font-medium">How it works:</span> When someone uses your referral code, 
              they get PKR 50 off their registration fee. You need at least 5 referrals to start providing discounts.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {referralStats.referralCount}
          </h3>
          <p className="text-gray-600">Total Referrals</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {referralStats.cashbackEligible ? 'Yes' : 'No'}
          </h3>
          <p className="text-gray-600">Cashback Eligible</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            PKR {referralStats.cashbackAmount}
          </h3>
          <p className="text-gray-600">Cashback Amount</p>
        </div>
      </div>

      {/* Progress to Cashback */}
      {!referralStats.cashbackEligible && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress to Cashback</h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Referrals: {Math.max(0, referralStats.referralCount - 3)}/27</span>
              <span>{Math.round((Math.max(0, referralStats.referralCount - 3) / 27) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((Math.max(0, referralStats.referralCount - 3) / 27) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            You need {Math.max(0, 3 - referralStats.referralCount)} more referral{Math.max(0, 3 - referralStats.referralCount) !== 1 ? 's' : ''} to become eligible for PKR 150 cashback.
          </p>
        </div>
      )}

      {/* Referred Users List */}
      {referralStats.referredUsers.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Referred Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {referralStats.referredUsers.map((referredUser, index) => (
                  <tr key={referredUser._id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      {referredUser.firstName} {referredUser.lastName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{referredUser.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        referredUser.registrationStatus === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : referredUser.registrationStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referredUser.registrationStatus === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {referredUser.registrationStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {referredUser.registrationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(referredUser.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cashback Information */}
      {referralStats.cashbackEligible && (
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Congratulations! 🎉</h3>
              <p className="text-green-700">
                You've reached {referralStats.referralCount} referrals and are eligible for PKR {Math.min(150 + Math.round((referralStats.referralCount - 3) * (1500 - 150) / 27), 1500)} cashback! 
                Contact the tournament organizers to claim your reward.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralStats; 