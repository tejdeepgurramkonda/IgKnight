import React, { createContext, useContext, useState, useCallback } from 'react';
import { gameApi } from '../services/gameApi';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [currentGame, setCurrentGame] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createGame = useCallback(async (timeControl, timeIncrement, isRated) => {
    try {
      setLoading(true);
      setError(null);
      const game = await gameApi.createGame(timeControl, timeIncrement, isRated);
      setCurrentGame(game);
      return game;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create game');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinGame = useCallback(async (gameId) => {
    try {
      setLoading(true);
      setError(null);
      const game = await gameApi.joinGame(gameId);
      setCurrentGame(game);
      return game;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join game');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGame = useCallback(async (gameId) => {
    try {
      setLoading(true);
      setError(null);
      const game = await gameApi.getGame(gameId);
      setCurrentGame(game);
      return game;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load game');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userGames = await gameApi.getUserGames();
      setGames(userGames);
      return userGames;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load games');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadActiveGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const activeGames = await gameApi.getActiveGames();
      setGames(activeGames);
      return activeGames;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load active games');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const makeMove = useCallback(async (gameId, from, to, promotion) => {
    try {
      setError(null);
      const updatedGame = await gameApi.makeMove(gameId, from, to, promotion);
      setCurrentGame(updatedGame);
      return updatedGame;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to make move');
      throw err;
    }
  }, []);

  const getLegalMoves = useCallback(async (gameId, square) => {
    try {
      setError(null);
      const moves = await gameApi.getLegalMoves(gameId, square);
      return moves;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get legal moves');
      throw err;
    }
  }, []);

  const resignGame = useCallback(async (gameId) => {
    try {
      setError(null);
      const updatedGame = await gameApi.resignGame(gameId);
      setCurrentGame(updatedGame);
      return updatedGame;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resign game');
      throw err;
    }
  }, []);

  const updateCurrentGame = useCallback((game) => {
    setCurrentGame(game);
  }, []);

  const value = {
    currentGame,
    games,
    loading,
    error,
    createGame,
    joinGame,
    loadGame,
    loadUserGames,
    loadActiveGames,
    makeMove,
    getLegalMoves,
    resignGame,
    updateCurrentGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
