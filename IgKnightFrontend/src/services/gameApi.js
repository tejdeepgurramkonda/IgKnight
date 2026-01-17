import axios from 'axios';

const API_URL = 'http://localhost:8081/api/chess';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Game API functions
export const gameApi = {
  // Create a new game
  createGame: async (timeControl = null, timeIncrement = 0, isRated = false) => {
    const response = await apiClient.post('/games', {
      timeControl,
      timeIncrement,
      isRated,
    });
    return response.data;
  },

  // Join an existing game
  joinGame: async (gameId) => {
    const response = await apiClient.post(`/games/${gameId}/join`);
    return response.data;
  },

  // Get game by ID
  getGame: async (gameId) => {
    const response = await apiClient.get(`/games/${gameId}`);
    return response.data;
  },

  // Get all user's games
  getUserGames: async () => {
    const response = await apiClient.get('/games');
    return response.data;
  },

  // Get active games
  getActiveGames: async () => {
    const response = await apiClient.get('/games/active');
    return response.data;
  },

  // Make a move
  makeMove: async (gameId, from, to, promotion = null) => {
    const response = await apiClient.post(`/games/${gameId}/moves`, {
      from,
      to,
      promotion,
    });
    return response.data;
  },

  // Get legal moves for a piece
  getLegalMoves: async (gameId, square) => {
    const response = await apiClient.get(`/games/${gameId}/legal-moves/${square}`);
    return response.data;
  },

  // Resign game
  resignGame: async (gameId) => {
    const response = await apiClient.post(`/games/${gameId}/resign`);
    return response.data;
  },
};

export default gameApi;
