import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Copy, CheckCircle, Gift, Users, DollarSign, ArrowRight } from 'lucide-react';
import { apiCall } from '../config/api';

const ReferralLink = () => {
  const { referralCode } = useParams();
  const navigate = useNavigate();
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (referralCode) {
      validateReferralCode();
    }
  }, [referralCode, validateReferralCode]);

  const validateReferralCode = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/users/validate-referral', 'POST', {
        referralCode: referralCode
      });

      if (response.success) {
        setReferrerInfo(response.data);
      } else {
        setError(response.message || 'Invalid referral code');
      }
    } catch (error) {
      setError('Failed to validate referral code');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/referral/${referralCode}`;
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

  const handleRegisterWithReferral = () => {
    navigate(`/register?ref=${referralCode}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">Invalid Referral Link</h1>
          <p className="text-red-700 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!referrerInfo) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-2xl p-8 mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <Gift className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">You've Been Invited! 🎉</h1>
          <p className="text-xl opacity-90 mb-6">
            {referrerInfo.referrerName} has invited you to join the Table Tennis Tournament 2024
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
            <p className="text-sm opacity-75 mb-1">Referral Code</p>
            <p className="text-2xl font-mono font-bold">{referralCode}</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Special Discount</h3>
              <p className="text-gray-600">Get PKR {referrerInfo.discount} off your registration</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Original Price:</span>
              <span className="text-gray-500 line-through">PKR {referrerInfo.originalAmount}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg">
              <span className="text-gray-700">Your Price:</span>
              <span className="text-green-600">PKR {referrerInfo.finalAmount}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Referrer Status</h3>
              <p className="text-gray-600">Your friend has {referrerInfo.referralCount} referrals</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">How it works:</span> When you register using this referral code, 
              you get a discount and help your friend earn cashback rewards!
            </p>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="card text-center bg-gradient-to-r from-primary-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
        <p className="text-gray-600 mb-6">
          Don't miss out on this exclusive offer! Register now and secure your spot in the tournament.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRegisterWithReferral}
            className="btn-primary text-lg px-8 py-3 flex items-center justify-center"
          >
            Register with Referral
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button
            onClick={copyReferralLink}
            className={`btn-secondary text-lg px-8 py-3 flex items-center justify-center ${
              copied ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Copy Referral Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tournament Info */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tournament Details</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="bg-primary-100 p-4 rounded-lg mb-4">
              <svg className="h-8 w-8 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Date</h4>
            <p className="text-gray-600">December 15-17, 2024</p>
          </div>
          <div className="card text-center">
            <div className="bg-primary-100 p-4 rounded-lg mb-4">
              <svg className="h-8 w-8 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Venue</h4>
            <p className="text-gray-600">Sports Complex Arena</p>
          </div>
          <div className="card text-center">
            <div className="bg-primary-100 p-4 rounded-lg mb-4">
              <svg className="h-8 w-8 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Prizes</h4>
            <p className="text-gray-600">Up to PKR 10,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLink; 