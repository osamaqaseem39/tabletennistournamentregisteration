import React, { useState, useEffect } from 'react';
import { Trophy, Users, Calendar, Award } from 'lucide-react';
import { api } from '../config/api';

const TournamentBracket = ({ tournamentId }) => {
  const [bracket, setBracket] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBracket();
    fetchStats();
  }, [tournamentId]);

  const fetchBracket = async () => {
    try {
      const response = await api.get(`/brackets/${tournamentId}`);
      setBracket(response.data.data);
    } catch (err) {
      setError('Failed to load tournament bracket');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/brackets/${tournamentId}/stats`);
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to load bracket stats:', err);
    }
  };

  const getRoundDisplayName = (round) => {
    const roundNames = {
      'round_of_128': 'Round of 128',
      'round_of_64': 'Round of 64',
      'round_of_32': 'Round of 32',
      'round_of_16': 'Round of 16',
      'quarter_finals': 'Quarter Finals',
      'semi_finals': 'Semi Finals',
      'final': 'Final',
      'third_place': 'Third Place'
    };
    return roundNames[round] || round;
  };

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getPlayerDisplayName = (player) => {
    if (!player) return 'TBD';
    return player.name || 'Unknown Player';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <Trophy className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Bracket Not Available</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!bracket) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-600 mb-2">
          <Trophy className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Tournament Bracket</h3>
        <p className="text-yellow-700">
          The tournament bracket will be generated after the registration deadline.
        </p>
      </div>
    );
  }

  // Group nodes by round
  const rounds = [...new Set(bracket.nodes.map(node => node.round))].sort((a, b) => {
    const roundOrder = [
      'round_of_128', 'round_of_64', 'round_of_32', 'round_of_16', 
      'quarter_finals', 'semi_finals', 'final', 'third_place'
    ];
    return roundOrder.indexOf(a) - roundOrder.indexOf(b);
  });

  return (
    <div className="space-y-6">
      {/* Bracket Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tournament Bracket</h2>
              <p className="text-gray-600">Current Round: {getRoundDisplayName(bracket.currentRound)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Status</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              bracket.status === 'active' ? 'bg-green-100 text-green-800' :
              bracket.status === 'generated' ? 'bg-blue-100 text-blue-800' :
              bracket.status === 'completed' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {bracket.status.charAt(0).toUpperCase() + bracket.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.totalMatches}</div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedMatches}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pendingMatches}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalRounds}</div>
              <div className="text-sm text-gray-600">Total Rounds</div>
            </div>
          </div>
        )}
      </div>

      {/* Bracket Tree */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto">
        <div className="flex space-x-8 min-w-max">
          {rounds.map((round, roundIndex) => {
            const roundNodes = bracket.nodes.filter(node => node.round === round);
            const isCurrentRound = round === bracket.currentRound;
            
            return (
              <div key={round} className="flex flex-col space-y-4">
                {/* Round Header */}
                <div className="text-center">
                  <h3 className={`font-semibold text-sm ${
                    isCurrentRound ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    {getRoundDisplayName(round)}
                  </h3>
                  {isCurrentRound && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full mx-auto mt-1"></div>
                  )}
                </div>

                {/* Matches in this round */}
                <div className="flex flex-col space-y-3">
                  {roundNodes.map((node, matchIndex) => (
                    <div
                      key={node._id}
                      className={`relative border rounded-lg p-3 min-w-[200px] ${
                        getMatchStatusColor(node.status)
                      }`}
                    >
                      {/* Match Number */}
                      <div className="absolute -top-2 -left-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                        {node.matchNumber}
                      </div>

                      {/* Player 1 */}
                      <div className={`mb-2 p-2 rounded ${
                        node.winner && node.winner.equals(node.player1?._id) 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-gray-50'
                      }`}>
                        <div className="text-sm font-medium">
                          {getPlayerDisplayName(node.player1)}
                        </div>
                        {node.player1 && (
                          <div className="text-xs text-gray-500">{node.player1.email}</div>
                        )}
                      </div>

                      {/* VS */}
                      <div className="text-center text-xs text-gray-500 mb-2">VS</div>

                      {/* Player 2 */}
                      <div className={`p-2 rounded ${
                        node.winner && node.winner.equals(node.player2?._id) 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-gray-50'
                      }`}>
                        <div className="text-sm font-medium">
                          {getPlayerDisplayName(node.player2)}
                        </div>
                        {node.player2 && (
                          <div className="text-xs text-gray-500">{node.player2.email}</div>
                        )}
                      </div>

                      {/* Match Status */}
                      <div className="mt-2 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          getMatchStatusColor(node.status)
                        }`}>
                          {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                        </span>
                      </div>

                      {/* Winner indicator */}
                      {node.winner && (
                        <div className="absolute -top-2 -right-2">
                          <Award className="h-5 w-5 text-yellow-600" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Round Progress */}
      {stats && stats.roundStats && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Round Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.roundStats).map(([round, roundStat]) => (
              <div key={round} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {getRoundDisplayName(round)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {roundStat.completed}/{roundStat.total}
                  </span>
                  <span className="text-primary-600 font-medium">
                    {Math.round((roundStat.completed / roundStat.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(roundStat.completed / roundStat.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket; 