import React, { useState } from 'react';
import { apiCall, API_CONFIG } from '../config/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);

  const runApiTests = async () => {
    setIsTesting(true);
    const results = {};

    try {
      // Test 1: Health check
      try {
        const healthResponse = await apiCall(API_CONFIG.ENDPOINTS.HEALTH);
        results.health = {
          success: true,
          message: 'Backend is reachable',
          data: healthResponse
        };
      } catch (error) {
        results.health = {
          success: false,
          message: error.message,
          error: error
        };
      }

      // Test 2: Get tournaments
      try {
        const tournamentsResponse = await apiCall(API_CONFIG.ENDPOINTS.TOURNAMENTS.GET_ALL);
        results.tournaments = {
          success: true,
          message: `Found ${tournamentsResponse.data?.length || 0} tournaments`,
          data: tournamentsResponse
        };
      } catch (error) {
        results.tournaments = {
          success: false,
          message: error.message,
          error: error
        };
      }

      // Test 3: Get users
      try {
        const usersResponse = await apiCall(API_CONFIG.ENDPOINTS.USERS.GET_ALL);
        results.users = {
          success: true,
          message: `Found ${usersResponse.data?.length || 0} users`,
          data: usersResponse
        };
      } catch (error) {
        results.users = {
          success: false,
          message: error.message,
          error: error
        };
      }

    } catch (error) {
      console.error('API test error:', error);
    } finally {
      setIsTesting(false);
    }

    setTestResults(results);
  };

  const getStatusIcon = (success) => {
    if (success === undefined) return null;
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = (success) => {
    if (success === undefined) return 'text-gray-600 bg-gray-100';
    return success ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Connection Test</h1>
        <p className="text-gray-600">Testing connection to backend server</p>
        <p className="text-sm text-gray-500 mt-2">
          Backend URL: {API_CONFIG.BASE_URL}
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">API Endpoints</h2>
          <button
            onClick={runApiTests}
            disabled={isTesting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Testing...
              </>
            ) : (
              'Run Tests'
            )}
          </button>
        </div>

        <div className="space-y-4">
          {/* Health Check */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Health Check</h3>
              {getStatusIcon(testResults.health?.success)}
            </div>
            <p className={`text-sm px-2 py-1 rounded-full inline-block ${getStatusColor(testResults.health?.success)}`}>
              {testResults.health?.message || 'Not tested yet'}
            </p>
            {testResults.health?.data && (
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(testResults.health.data, null, 2)}
              </pre>
            )}
          </div>

          {/* Tournaments */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Tournaments API</h3>
              {getStatusIcon(testResults.tournaments?.success)}
            </div>
            <p className={`text-sm px-2 py-1 rounded-full inline-block ${getStatusColor(testResults.tournaments?.success)}`}>
              {testResults.tournaments?.message || 'Not tested yet'}
            </p>
            {testResults.tournaments?.data && (
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(testResults.tournaments.data, null, 2)}
              </pre>
            )}
          </div>

          {/* Users */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Users API</h3>
              {getStatusIcon(testResults.users?.success)}
            </div>
            <p className={`text-sm px-2 py-1 rounded-full inline-block ${getStatusColor(testResults.users?.success)}`}>
              {testResults.users?.message || 'Not tested yet'}
            </p>
            {testResults.users?.data && (
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(testResults.users.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Backend URL:</span>
            <code className="bg-gray-100 px-2 py-1 rounded">{API_CONFIG.BASE_URL}</code>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Environment:</span>
            <span className="text-blue-600">{process.env.NODE_ENV}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Status:</span>
            {Object.keys(testResults).length > 0 ? (
              <span className={`px-2 py-1 rounded-full text-xs ${
                Object.values(testResults).every(r => r.success) 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-yellow-600 bg-yellow-100'
              }`}>
                {Object.values(testResults).every(r => r.success) ? 'All Tests Passed' : 'Some Tests Failed'}
              </span>
            ) : (
              <span className="text-gray-500">Not tested</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 