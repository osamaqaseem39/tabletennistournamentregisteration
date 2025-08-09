import React, { useState, useEffect } from 'react';
import { Trophy, Play, CheckCircle, XCircle, Users, Settings, Award } from 'lucide-react';
import { api } from '../config/api';

const BracketManager = ({ tournamentId, onBracketGenerated }) => {
  const [tournament, setTournament] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchTournament();
    fetchBracket();
  }, [tournamentId]);

  const fetchTournament = async () => {
    try {
      const response = await api.get(`/tournaments/${tournamentId}`);
      setTournament(response.data.data);
    } catch (err) {
      setError('Failed to load tournament information');
    } finally {
      setLoading(false);
    }
  };

  const fetchBracket = async () => {
    try {
      const response = await api.get(`/brackets/${tournamentId}`);
      setBracket(response.data.data);
    } catch (err) {
      // Bracket might not exist yet
      setBracket(null);
    }
  };

  const generateBracket = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post(`/brackets/generate/${tournamentId}`);
      setBracket(response.data.data);
      setSuccess('Tournament bracket generated successfully!');
      
      if (onBracketGenerated) {
        onBracketGenerated(response.data.data);
      }
      
      // Refresh tournament data
      fetchTournament();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate tournament bracket');
    } finally {
      setGenerating(false);
    }
  };

  const seedBracket = async () => {
    setSeeding(true);
    setError(null);
    setSuccess(null);

    try {
      // For now, we'll use a simple seeding (can be enhanced with ranking logic)
      const response = await api.post(`/brackets/seed/${bracket._id}`, {
        seedOrder: [] // Empty array for random seeding
      });
      
      setBracket(prev => ({ ...prev, ...response.data.data }));
      setSuccess('Tournament bracket seeded successfully!');
      
      // Refresh tournament data
      fetchTournament();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to seed tournament bracket');
    } finally {
      setSeeding(false);
    }
  };

  const updateMatchResult = async (nodeId, winnerId, player1Score, player2Score) => {
    try {
      const response = await api.put(`/brackets/${bracket._id}/match/${nodeId}`, {
        winnerId,
        player1Score,
        player2Score
      });

      // Refresh bracket data
      fetchBracket();
      setSuccess('Match result updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update match result');
    }
  };

  const canGenerateBracket = () => {
    if (!tournament) return false;
    
    const now = new Date();
    const deadline = new Date(tournament.registrationDeadline);
    
    return (
      tournament.status === 'registration' &&
      now >= deadline &&
      tournament.currentParticipants >= 16 &&
      !bracket
    );
  };

  const canSeedBracket = () => {
    return bracket && bracket.status === 'generated' && !bracket.isSeeded;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bracket Management</h2>
              <p className="text-gray-600">Manage tournament brackets and match progression</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Tournament Status</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              tournament?.status === 'active' ? 'bg-green-100 text-green-800' :
              tournament?.status === 'seeding' ? 'bg-blue-100 text-blue-800' :
              tournament?.status === 'registration' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {tournament?.status?.charAt(0).toUpperCase() + tournament?.status?.slice(1)}
            </div>
          </div>
        </div>

        {/* Tournament Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {tournament?.currentParticipants || 0}
            </div>
            <div className="text-sm text-gray-600">Participants</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tournament?.maxParticipants || 0}
            </div>
            <div className="text-sm text-gray-600">Max Capacity</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {tournament?.registrationDeadline ? 
                new Date(tournament.registrationDeadline).toLocaleDateString() : 'N/A'
              }
            </div>
            <div className="text-sm text-gray-600">Registration Deadline</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {bracket ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">Bracket Generated</div>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {/* Bracket Generation */}
      {canGenerateBracket() && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generate Tournament Bracket
              </h3>
              <p className="text-gray-600">
                Registration deadline has passed. Generate the tournament bracket to proceed.
              </p>
            </div>
            <button
              onClick={generateBracket}
              disabled={generating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Bracket
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bracket Seeding */}
      {canSeedBracket() && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seed Tournament Bracket
              </h3>
              <p className="text-gray-600">
                Bracket generated successfully. Seed the bracket to begin the tournament.
              </p>
            </div>
            <button
              onClick={seedBracket}
              disabled={seeding}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seeding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Seeding...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Seed Bracket
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bracket Status */}
      {bracket && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Bracket Status</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-primary-600">
                {bracket.totalRounds}
              </div>
              <div className="text-sm text-gray-600">Total Rounds</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bracket.currentRound.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="text-sm text-gray-600">Current Round</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {bracket.nodes.filter(n => n.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed Matches</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {bracket.isSeeded ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-gray-600">Seeded</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">Bracket Status:</div>
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
      )}

      {/* Match Management */}
      {bracket && bracket.status === 'active' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Management</h3>
          
          <div className="space-y-4">
            {bracket.nodes
              .filter(node => node.status === 'pending' && node.player1 && node.player2)
              .map(node => (
                <div key={node._id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-700">
                      Match #{node.matchNumber} - {node.round.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <div className="font-medium">{node.player1?.name || 'TBD'}</div>
                      <div className="text-sm text-gray-500">Player 1</div>
                    </div>
                    
                    <div className="text-center text-gray-500 font-medium">VS</div>
                    
                    <div className="text-center">
                      <div className="font-medium">{node.player2?.name || 'TBD'}</div>
                      <div className="text-sm text-gray-500">Player 2</div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      onClick={() => updateMatchResult(node._id, node.player1._id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {node.player1?.name || 'Player 1'} Wins
                    </button>
                    <button
                      onClick={() => updateMatchResult(node._id, node.player2._id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {node.player2?.name || 'Player 2'} Wins
                    </button>
                  </div>
                </div>
              ))}
            
            {bracket.nodes.filter(node => node.status === 'pending' && node.player1 && node.player2).length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No pending matches to manage</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BracketManager; 