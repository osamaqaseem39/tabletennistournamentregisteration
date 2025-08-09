import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Trophy,
  Award
} from 'lucide-react';

const TournamentSchedule = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRound, setFilterRound] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [expandedRounds, setExpandedRounds] = useState(new Set(['round1']));

  const [scheduleData, setScheduleData] = useState({
    tournamentInfo: {
      name: 'Table Tennis Tournament 2024',
      dates: ['2024-12-15', '2024-12-16', '2024-12-17'],
      venue: 'Sports Complex Arena',
      totalRounds: 7,
      totalParticipants: 128
    },
    rounds: [
      {
        id: 'round1',
        name: 'Round 1',
        date: '2024-12-15',
        time: '09:00 AM - 12:00 PM',
        matches: [
          { id: 1, player1: 'John Doe', player2: 'Mike Johnson', court: 'Court A', time: '09:00 AM', status: 'scheduled' },
          { id: 2, player1: 'Sarah Wilson', player2: 'David Brown', court: 'Court B', time: '09:30 AM', status: 'scheduled' },
          { id: 3, player1: 'Emily Davis', player2: 'James Wilson', court: 'Court C', time: '10:00 AM', status: 'scheduled' },
          { id: 4, player1: 'Michael Lee', player2: 'Lisa Anderson', court: 'Court D', time: '10:30 AM', status: 'scheduled' }
        ]
      },
      {
        id: 'round2',
        name: 'Round 2',
        date: '2024-12-15',
        time: '02:00 PM - 05:00 PM',
        matches: [
          { id: 5, player1: 'Winner Match 1', player2: 'Winner Match 2', court: 'Court A', time: '02:00 PM', status: 'pending' },
          { id: 6, player1: 'Winner Match 3', player2: 'Winner Match 4', court: 'Court B', time: '02:30 PM', status: 'pending' }
        ]
      },
      {
        id: 'round3',
        name: 'Quarter Finals',
        date: '2024-12-16',
        time: '09:00 AM - 12:00 PM',
        matches: [
          { id: 7, player1: 'TBD', player2: 'TBD', court: 'Court A', time: '09:00 AM', status: 'pending' },
          { id: 8, player1: 'TBD', player2: 'TBD', court: 'Court B', time: '09:30 AM', status: 'pending' }
        ]
      },
      {
        id: 'round4',
        name: 'Semi Finals',
        date: '2024-12-16',
        time: '02:00 PM - 05:00 PM',
        matches: [
          { id: 9, player1: 'TBD', player2: 'TBD', court: 'Court A', time: '02:00 PM', status: 'pending' }
        ]
      },
      {
        id: 'round5',
        name: 'Finals',
        date: '2024-12-17',
        time: '02:00 PM - 05:00 PM',
        matches: [
          { id: 10, player1: 'TBD', player2: 'TBD', court: 'Court A', time: '02:00 PM', status: 'pending' }
        ]
      }
    ]
  });

  const toggleRoundExpansion = (roundId) => {
    const newExpanded = new Set(expandedRounds);
    if (newExpanded.has(roundId)) {
      newExpanded.delete(roundId);
    } else {
      newExpanded.add(roundId);
    }
    setExpandedRounds(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'scheduled':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'scheduled':
        return 'Scheduled';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const filteredRounds = scheduleData.rounds.filter(round => {
    const matchesSearch = round.matches.some(match => 
      match.player1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.player2.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const roundFilter = filterRound === 'all' || round.id === filterRound;
    const dateFilter = filterDate === 'all' || round.date === filterDate;
    
    return (searchTerm === '' || matchesSearch) && roundFilter && dateFilter;
  });

  const userMatches = scheduleData.rounds.flatMap(round => 
    round.matches.filter(match => 
      match.player1 === currentUser?.email?.split('@')[0] || 
      match.player2 === currentUser?.email?.split('@')[0]
    )
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Schedule</h1>
        <p className="text-gray-600">View all matches, brackets, and tournament progression</p>
      </div>

      {/* Tournament Info Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Tournament Dates</h3>
          <p className="text-gray-600">Dec 15-17, 2024</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Venue</h3>
          <p className="text-gray-600">{scheduleData.tournamentInfo.venue}</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Total Rounds</h3>
          <p className="text-gray-600">{scheduleData.tournamentInfo.totalRounds}</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <p className="text-gray-600">{scheduleData.tournamentInfo.totalParticipants}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Full Schedule
          </button>
          <button
            onClick={() => setActiveTab('my-matches')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-matches'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Matches
          </button>
          <button
            onClick={() => setActiveTab('brackets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'brackets'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tournament Brackets
          </button>
        </nav>
      </div>

      {/* Full Schedule Tab */}
      {activeTab === 'schedule' && (
        <div>
          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by player name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
                  />
                </div>
              </div>
              <select
                value={filterRound}
                onChange={(e) => setFilterRound(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Rounds</option>
                {scheduleData.rounds.map(round => (
                  <option key={round.id} value={round.id}>{round.name}</option>
                ))}
              </select>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Dates</option>
                {scheduleData.tournamentInfo.dates.map(date => (
                  <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-6">
            {filteredRounds.map((round) => (
              <div key={round.id} className="card">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleRoundExpansion(round.id)}
                >
                  <div className="flex items-center space-x-4">
                                               <div className="bg-primary-100 p-3 rounded-full">
                             <Gamepad2 className="h-6 w-6 text-primary-600" />
                           </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{round.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(round.date).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{round.time}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{round.matches.length} matches</span>
                    {expandedRounds.has(round.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedRounds.has(round.id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid gap-4">
                      {round.matches.map((match) => (
                        <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                <MapPin className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{match.player1}</span>
                                  <span className="text-gray-400">vs</span>
                                  <span className="font-medium text-gray-900">{match.player2}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                  <span className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{match.court}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{match.time}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                                {getStatusText(match.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Matches Tab */}
      {activeTab === 'my-matches' && (
        <div>
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Tournament Matches</h3>
            
            {userMatches.length > 0 ? (
              <div className="space-y-4">
                {userMatches.map((match) => {
                  const round = scheduleData.rounds.find(r => 
                    r.matches.some(m => m.id === match.id)
                  );
                  return (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                                                         <div className="bg-blue-100 p-3 rounded-full">
                                 <Gamepad2 className="h-5 w-5 text-blue-600" />
                               </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{round?.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{match.player1}</span>
                              <span className="text-gray-400">vs</span>
                              <span className="font-medium text-gray-900">{match.player2}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(match.date || round?.date).toLocaleDateString()}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{match.time}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{match.court}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                            {getStatusText(match.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No matches found for you yet</p>
                <p className="text-sm text-gray-500">Matches will be assigned after registration closes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tournament Brackets Tab */}
      {activeTab === 'brackets' && (
        <div>
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tournament Brackets</h3>
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tournament brackets will be available after registration closes</p>
              <p className="text-sm text-gray-500">Check back on December 10th, 2024</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentSchedule; 