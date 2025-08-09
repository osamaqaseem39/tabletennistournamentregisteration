// API Configuration
const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://tabletennistournamentregisteration-backend-production.up.railway.app/api'
    : 'http://localhost:5000/api',
  
  // Endpoints
  ENDPOINTS: {
    // User endpoints
    USERS: {
      REGISTER: '/users/register',
      LOGIN: '/users/login',
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      UPLOAD_PAYMENT_PROOF: '/users/payment-proof',
      GET_ALL: '/users',
      UPDATE_STATUS: (id) => `/users/${id}/status`
    },
    
    // Tournament endpoints
    TOURNAMENTS: {
      CREATE: '/tournaments',
      GET_ALL: '/tournaments',
      GET_BY_ID: (id) => `/tournaments/${id}`,
      UPDATE: (id) => `/tournaments/${id}`,
      DELETE: (id) => `/tournaments/${id}`,
      REGISTER: (tournamentId) => `/tournaments/${tournamentId}/register`,
      GET_REGISTRATIONS: (tournamentId) => `/tournaments/${tournamentId}/registrations`,
      UPDATE_REGISTRATION_STATUS: '/tournaments/registrations',
      GENERATE_BRACKET: (tournamentId) => `/tournaments/${tournamentId}/bracket`,
      GET_MATCHES: (tournamentId) => `/tournaments/${tournamentId}/matches`,
      UPDATE_MATCH_RESULT: '/tournaments/matches'
    },
    
    // Bracket endpoints
    BRACKETS: {
      GET_BY_TOURNAMENT: (tournamentId) => `/brackets/tournament/${tournamentId}`,
      UPDATE_MATCH: (matchId) => `/brackets/matches/${matchId}`,
      GET_MATCHES: (tournamentId) => `/brackets/tournament/${tournamentId}/matches`
    },
    
    // Health check
    HEALTH: '/health'
  }
};

// Export both as named export and default export
export { API_CONFIG };
export default API_CONFIG;

// Create an api object with methods that components expect
export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors'
    });
    return handleApiResponse(response);
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      mode: 'cors'
    });
    return handleApiResponse(response);
  },
  
  put: async (endpoint, data) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      mode: 'cors'
    });
    return handleApiResponse(response);
  },
  
  delete: async (endpoint) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      mode: 'cors'
    });
    return handleApiResponse(response);
  }
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
export const handleApiResponse = async (response) => {
  console.log('handleApiResponse called with:', response);
  
  if (!response.ok) {
    console.log('Response not ok, status:', response.status);
    const errorData = await response.json().catch(() => ({}));
    console.log('Error data:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  console.log('Response is ok, parsing JSON...');
  const jsonResult = await response.json();
  console.log('Parsed JSON result:', jsonResult);
  
  return jsonResult;
};

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const config = {
    headers: getAuthHeaders(),
    mode: 'cors',
    ...options
  };

  try {
    console.log('Making API call to:', url);
    console.log('Request config:', config);
    
    const response = await fetch(url, config);
    console.log('Raw response:', response);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const result = await handleApiResponse(response);
    console.log('Parsed response result:', result);
    
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 