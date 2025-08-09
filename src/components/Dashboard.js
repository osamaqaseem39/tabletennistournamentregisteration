import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { apiCall, API_CONFIG } from '../config/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Gamepad2,
  Award,
  TrendingUp,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    upcomingMatches: [],
    tournamentStats: {
      totalParticipants: 0,
      registeredParticipants: 0,
      daysUntilTournament: 0,
      prizePool: 0
    },
    userStats: {
      registrationStatus: 'pending',
      paymentStatus: 'pending',
      referralCount: 0,
      cashbackEligible: false,
      cashbackAmount: 0,
      nextMatch: null
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch tournaments to get tournament stats
      const tournamentsResponse = await apiCall(API_CONFIG.ENDPOINTS.TOURNAMENTS.GET_ALL);
      
      if (tournamentsResponse.success && tournamentsResponse.data.length > 0) {
        const activeTournament = tournamentsResponse.data[0]; // Get first tournament for now
        
        // Calculate days until tournament
        const tournamentDate = new Date(activeTournament.startDate);
        const today = new Date();
        const daysUntil = Math.ceil((tournamentDate - today) / (1000 * 60 * 60 * 24));
        
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

        // Fetch upcoming matches if user is registered
        let upcomingMatches = [];
        if (userRegistration && userRegistration.status === 'approved') {
          try {
            const matchesResponse = await apiCall(
              API_CONFIG.ENDPOINTS.TOURNAMENTS.GET_MATCHES(activeTournament._id)
            );
            if (matchesResponse.success) {
              upcomingMatches = matchesResponse.data
                .filter(match => 
                  (match.player1 === currentUser?._id || match.player2 === currentUser?._id) &&
                  match.status === 'scheduled'
                )
                .slice(0, 5); // Show only next 5 matches
            }
          } catch (error) {
            console.log('No matches found');
          }
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

        setDashboardData({
          upcomingMatches,
          tournamentStats: {
            totalParticipants: activeTournament.maxParticipants || 128,
            registeredParticipants: activeTournament.currentParticipants || 0,
            daysUntilTournament: Math.max(0, daysUntil),
            prizePool: activeTournament.prizePool || 10000
          },
          userStats: {
            registrationStatus: userRegistration?.status || 'pending',
            paymentStatus: userRegistration?.paymentStatus || 'pending',
            referralCount: userProfile?.referralCount || 0,
            cashbackEligible: userProfile?.cashbackEligible || false,
            cashbackAmount: userProfile?.cashbackAmount || 0,
            nextMatch: upcomingMatches[0] || null
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You must be logged in to view the dashboard.</p>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600">
          Here's your tournament dashboard and upcoming schedule
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Gamepad2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Registration</p>
              <p className="text-xl font-bold text-gray-900 capitalize">
                {dashboardData.userStats.registrationStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <p className="text-xl font-bold text-gray-900 capitalize">
                {dashboardData.userStats.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Referrals</p>
              <p className="text-xl font-bold text-gray-900">
                {dashboardData.userStats.referralCount}/30
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cashback</p>
              <p className="text-xl font-bold text-gray-900">
                {dashboardData.userStats.cashbackEligible ? 'Eligible' : 'Not Yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tournament Overview */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tournament Overview</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-8 w-8 text-primary-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tournament Date</h3>
                    <p className="text-gray-600">December 15-17, 2024</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {dashboardData.tournamentStats.daysUntilTournament}
                  </p>
                  <p className="text-gray-600">days remaining</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
                    <p className="text-gray-600">Registration Progress</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {dashboardData.tournamentStats.registeredParticipants}
                  </p>
                  <p className="text-gray-600">of {dashboardData.tournamentStats.totalParticipants}</p>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(dashboardData.tournamentStats.registeredParticipants / dashboardData.tournamentStats.totalParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Prize Pool</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    PKR {dashboardData.tournamentStats.prizePool.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Your Referral Code</h4>
                    <p className="text-lg font-bold text-blue-600">REF123456</p>
                    <Link to="/status" className="text-sm text-blue-600 hover:underline">
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Matches */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Upcoming Matches</h2>
              <Link to="/schedule" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View full schedule →
              </Link>
            </div>

            {dashboardData.upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcomingMatches.map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                                                       <div className="bg-primary-100 p-3 rounded-full">
                                 <Gamepad2 className="h-5 w-5 text-primary-600" />
                               </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{match.round}</h4>
                          <p className="text-gray-600">vs. {match.opponent}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{match.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{match.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{match.court}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                                       <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming matches scheduled yet</p>
                <p className="text-sm text-gray-500">Check back closer to the tournament date</p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Stats */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Program</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{dashboardData.userStats.referralCount}</p>
              <p className="text-sm text-blue-700">Total Referrals</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-900">
                {dashboardData.userStats.cashbackEligible ? 'Eligible' : 'Not Eligible'}
              </p>
              <p className="text-sm text-green-700">Cashback Status</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-900">PKR {dashboardData.userStats.cashbackAmount}</p>
              <p className="text-sm text-yellow-700">Cashback Amount</p>
            </div>
          </div>
          
          {!dashboardData.userStats.cashbackEligible && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress to Cashback: {dashboardData.userStats.referralCount}/30</span>
                <span>{Math.round((dashboardData.userStats.referralCount / 30) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((dashboardData.userStats.referralCount / 30) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                You need {3 - dashboardData.userStats.referralCount} more referral{3 - dashboardData.userStats.referralCount !== 1 ? 's' : ''} to become eligible for PKR 150 cashback.
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <Link 
              to="/referrals" 
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <span>View Detailed Referral Stats</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/status" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Check Status</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link 
                to="/profile" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Update Profile</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link 
                to="/rules" 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Tournament Rules</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Tournament Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Info</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>Sports Complex Arena</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Dec 15-17, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>128 participants max</span>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-4">
              Have questions about the tournament or need assistance?
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 