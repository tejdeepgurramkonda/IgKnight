import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import WinRateChart from '../components/WinRateChart';
import StatsRing from '../components/StatsRing';
import SoundToggle from '../components/SoundToggle';
import { Button } from '../components/ui';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { createGame, loadActiveGames, loadUserGames, games, loading, error } = useGame();
  const toast = useToast();
  const navigate = useNavigate();
  const [activeGames, setActiveGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [creatingGame, setCreatingGame] = useState(false);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    currentStreak: 0
  });

  useEffect(() => {
    loadActiveGames().then(setActiveGames).catch(console.error);
    loadUserGames().then(games => {
      const completed = games.filter(g => g.status !== 'IN_PROGRESS' && g.status !== 'WAITING').slice(0, 5);
      setRecentGames(completed);
      
      // Calculate statistics from all games
      const allGames = games.filter(g => g.status !== 'IN_PROGRESS' && g.status !== 'WAITING');
      const gamesPlayed = allGames.length;
      const wins = allGames.filter(g => g.winnerId === user?.userId).length;
      const draws = allGames.filter(g => !g.winnerId).length;
      const losses = gamesPlayed - wins - draws;
      const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
      
      // Calculate current streak (wins/losses in a row)
      let currentStreak = 0;
      const sortedGames = [...allGames].sort((a, b) => 
        new Date(b.endedAt || b.updatedAt) - new Date(a.endedAt || a.updatedAt)
      );
      
      if (sortedGames.length > 0) {
        const lastGameWon = sortedGames[0].winnerId === user?.userId;
        for (const game of sortedGames) {
          const isWin = game.winnerId === user?.userId;
          if ((lastGameWon && isWin) || (!lastGameWon && !isWin && game.winnerId)) {
            currentStreak++;
          } else if (game.winnerId) { // Skip draws for streak calculation
            break;
          }
        }
      }
      
      setStats({ gamesPlayed, wins, losses, draws, winRate, currentStreak });
    }).catch(console.error);
  }, [user?.userId]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleCreateGame = async (timeControl = null, timeIncrement = 0) => {
    try {
      setCreatingGame(true);
      const game = await createGame(timeControl, timeIncrement, false);
      navigate(`/game/${game.id}`);
    } catch (err) {
      console.error('Failed to create game:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create game. Please try again.';
      toast.error(errorMessage);
    } finally {
      setCreatingGame(false);
    }
  };

  const handleJoinGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const getGameResult = (game) => {
    if (!game.winnerId) return 'Draw';
    const isWinner = game.winnerId === user?.userId;
    return isWinner ? 'Won' : 'Lost';
  };

  const getGameResultClass = (game) => {
    if (!game.winnerId) return 'draw';
    const isWinner = game.winnerId === user?.userId;
    return isWinner ? 'win' : 'loss';
  };

  const formatGameTime = (createdAt) => {
    const now = new Date();
    const gameTime = new Date(createdAt);
    const diffMs = now - gameTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <div>
            <div className="brand-name">Chess Arena</div>
            <div className="brand-tagline">Master the game</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => navigate('/dashboard')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/find-game')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
            </svg>
            <span>Find Game</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/leaderboard')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z"/>
            </svg>
            <span>Leaderboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/history')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            <span>History</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/profile')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span>Profile</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/settings')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <SoundToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, {user?.username}!</h1>
          <p className="welcome-subtitle">Ready for your next challenge?</p>
        </div>

        {/* Stats Grid */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Player Statistics</h2>
          <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Games Played</div>
              <div className="stat-value">{stats.gamesPlayed}</div>
            </div>
            <div className="stat-icon-container">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,6H3A1,1 0 0,0 2,7V17A1,1 0 0,0 3,18H21A1,1 0 0,0 22,17V7A1,1 0 0,0 21,6M20,16H4V8H20V16M6,9H18V15H6V9Z"/>
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Wins</div>
              <div className="stat-value">{stats.wins}</div>
            </div>
            <div className="stat-icon-container">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z"/>
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Win Rate</div>
              <div className="stat-value">{stats.winRate}%</div>
            </div>
            <div className="stat-icon-container">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
              </svg>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value">{stats.currentStreak}</div>
            </div>
            <div className="stat-icon-container">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.5,1L2,6V8H21V6M16,10V17H19V10M2,22H21V19H2M10,10V17H13V10M4,10V17H7V10H4Z"/>
              </svg>
            </div>
          </div>
        </div>
        </section>

        {/* Performance Visualization */}
        {stats.gamesPlayed > 0 && (
          <section className="performance-section">
            <h2 className="section-title">Performance Overview</h2>
            <div className="performance-grid">
              <div className="performance-card">
                <h3 className="card-subtitle">Game Results</h3>
                <WinRateChart 
                  wins={stats.wins} 
                  losses={stats.losses} 
                  draws={stats.draws} 
                />
              </div>
              <div className="performance-card">
                <h3 className="card-subtitle">Statistics</h3>
                <div className="stats-rings">
                  <StatsRing 
                    value={stats.winRate} 
                    max={100} 
                    label="Win Rate" 
                    color="var(--success-color)" 
                  />
                  <StatsRing 
                    value={stats.currentStreak} 
                    max={10} 
                    label="Streak" 
                    color="var(--accent-blue)" 
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick Play Section */}
        <section className="quick-play-section">
          <h2 className="section-title">Quick Play</h2>
          {creatingGame ? (
            <LoadingSpinner size="medium" message="Creating game..." />
          ) : (
            <div className="game-modes-grid">
            <button 
              className="game-mode-card" 
              onClick={() => handleCreateGame(180, 2)}
              disabled={creatingGame}
            >
              <div className="mode-icon blitz">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
                </svg>
              </div>
              <div className="mode-name">Blitz</div>
              <div className="mode-time">3+2</div>
              <div className="mode-description">3 min + 2 sec</div>
            </button>

            <button 
              className="game-mode-card"
              onClick={() => handleCreateGame(600, 0)}
              disabled={creatingGame}
            >
              <div className="mode-icon rapid">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                </svg>
              </div>
              <div className="mode-name">Rapid</div>
              <div className="mode-time">10+0</div>
              <div className="mode-description">10 minutes</div>
            </button>

            <button 
              className="game-mode-card"
              onClick={() => handleCreateGame(60, 0)}
              disabled={creatingGame}
            >
              <div className="mode-icon bullet">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                </svg>
              </div>
              <div className="mode-name">Bullet</div>
              <div className="mode-time">1+0</div>
              <div className="mode-description">1 minute</div>
            </button>
          </div>
          )}
        </section>

        {/* Recent Games Section */}
        <section className="recent-games-section">
          <div className="section-header">
            <h2 className="section-title">Recent Games</h2>
            {recentGames.length > 0 && <button className="view-all-btn">View All</button>}
          </div>
          {recentGames.length > 0 ? (
            <div className="recent-games-list">
              {recentGames.map(game => (
                <div key={game.id} className="recent-game-item" onClick={() => handleJoinGame(game.id)}>
                  <div className="game-player-info">
                    <div className="player-avatar">
                      {(game.whitePlayer?.id === user?.userId ? game.blackPlayer?.username : game.whitePlayer?.username)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="player-details">
                      <div className="player-name">
                        {game.whitePlayer?.id === user?.userId ? game.blackPlayer?.username : game.whitePlayer?.username}
                      </div>
                      <div className="game-defense">Sicilian Defense</div>
                    </div>
                  </div>
                  <div className="game-result-info">
                    <div className="game-time-ago">{formatGameTime(game.endedAt || game.updatedAt)}</div>
                    <div className={`game-result-badge ${getGameResultClass(game)}`}>
                      {getGameResult(game)}
                    </div>
                    <div className="rating-change">
                      {game.winnerId === user?.userId ? '+12' : '-8'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="♟️"
              title="No games played yet"
              description="Start your chess journey by playing your first game!"
              action={
                <Button onClick={() => handleCreateGame(600, 0)} variant="primary">
                  Play Now
                </Button>
              }
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
