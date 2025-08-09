import React from 'react';
import {
  Award,
  Clock,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

const Rules = () => {
  const rules = [
    {
      category: 'General Rules',
      items: [
        'All matches follow International Table Tennis Federation (ITTF) rules',
        'Players must arrive 15 minutes before their scheduled match time',
        'Proper sports attire and non-marking shoes are required',
        'Players must bring their own rackets (rackets will not be provided)',
        'Cell phones must be silenced during matches'
      ]
    },
    {
      category: 'Match Format',
      items: [
        'Best of 5 games (first to win 3 games)',
        'Each game is played to 11 points',
        'Must win by 2 points if score reaches 10-10',
        'Players serve 2 points each, alternating',
        'Service must be tossed at least 6 inches high'
      ]
    },
    {
      category: 'Tournament Structure',
      items: [
        'Single elimination bracket format',
        '128 participants maximum',
        'Seeding based on registration order and skill level',
        'Matches will be scheduled in 30-minute time slots',
        'Winners advance to next round automatically'
      ]
    },
    {
      category: 'Code of Conduct',
      items: [
        'Respect all players, officials, and spectators',
        'No abusive language or unsportsmanlike behavior',
        'Disputes must be resolved through tournament officials',
        'Players may be disqualified for rule violations',
        'Appeals must be submitted within 30 minutes of match completion'
      ]
    },
    {
      category: 'Equipment Standards',
      items: [
        'Rackets must have approved rubber on both sides',
        'Rubber must be ITTF approved and in good condition',
        'Ball color must be white or orange (40mm diameter)',
        'Table must meet ITTF standards (2.74m x 1.525m)',
        'Net height must be 15.25cm from table surface'
      ]
    }
  ];

  const penalties = [
    'Warning for first minor violation',
    'Point penalty for repeated violations',
    'Game penalty for serious violations',
    'Match forfeiture for severe violations',
    'Tournament disqualification for extreme cases'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Rules & Regulations</h1>
        <p className="text-gray-600">Please review all rules before participating in the tournament</p>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              All participants are required to read and understand these rules. Ignorance of the rules 
              is not an excuse for violations. Tournament officials have the final authority on all 
              rule interpretations and decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Sections */}
      <div className="space-y-6">
        {rules.map((section, index) => (
          <div key={index} className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary-600" />
              <span>{section.category}</span>
            </h2>
            <ul className="space-y-3">
              {section.items.map((rule, ruleIndex) => (
                <li key={ruleIndex} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Penalties Section */}
      <div className="card bg-red-50 border-red-200 mt-8">
        <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span>Penalties & Violations</span>
        </h2>
        <div className="space-y-3">
          {penalties.map((penalty, index) => (
            <div key={index} className="flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-800">{penalty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Info */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Match Duration</h3>
          <p className="text-gray-600">30 minutes per match</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          <p className="text-gray-600">128 maximum</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Venue</h3>
          <p className="text-gray-600">Sports Complex Arena</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card bg-gray-50 border-gray-200 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions About Rules?</h3>
        <p className="text-gray-700 mb-4">
          If you have any questions about these rules or need clarification, please contact our 
          tournament officials or support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-primary">
            Contact Officials
          </button>
          <button className="btn-secondary">
            Download Rules PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rules; 