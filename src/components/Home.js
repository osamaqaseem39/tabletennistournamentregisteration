import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Trophy, Users, Calendar, MapPin, Award } from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-4 rounded-full">
            <Gamepad2 className="h-16 w-16 text-primary-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Table Tennis Tournament 2024
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join the most exciting table tennis competition of the year! 
          Register now and get a chance to win amazing prizes and cashback rewards.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!currentUser ? (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Register Now
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                Login to Check Status
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-3 bg-green-600 hover:bg-green-700">
                Login for Referrals
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
              <Link to="/status" className="btn-secondary text-lg px-8 py-3">
                Check Status
              </Link>
              <Link to="/referrals" className="btn-secondary text-lg px-8 py-3 bg-green-600 hover:bg-green-700">
                Share Referral Link
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Authentication Info */}
      {!currentUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🔐 Authentication Required
            </h3>
            <p className="text-blue-700 mb-4">
              To check your registration status, view your dashboard, and access referral features, 
              you need to be logged in to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="btn-primary">
                Login Now
              </Link>
              <Link to="/register" className="btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Info */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Tournament Date</h3>
          <p className="text-gray-600">December 15-17, 2024</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Venue</h3>
          <p className="text-gray-600">Sports Complex Arena</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Participants</h3>
          <p className="text-gray-600">Limited to 128 players</p>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Tournament Features
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Trophy className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Cash Prizes</h4>
                <p className="text-gray-600">Win up to $10,000 in total prize money</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Award className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Referral Rewards</h4>
                <p className="text-gray-600">Get 60% cashback when 5 people use your referral code</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Gamepad2 className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Professional Equipment</h4>
                <p className="text-gray-600">High-quality tables and equipment provided</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Fee
          </h3>
          <div className="text-4xl font-bold text-primary-600 mb-4">
            $150
          </div>
          <p className="text-gray-600 mb-6">
            Includes tournament entry, official jersey, and refreshments
          </p>
          <Link to="/register" className="btn-primary w-full text-center">
            Register Now
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-blue-600 text-white p-12 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Compete?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Don't miss out on this amazing opportunity. Register today and start your journey to victory!
        </p>
        <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home; 