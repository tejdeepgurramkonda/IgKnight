import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './History.css';

const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadUserGames } = useGame();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const list = await loadUserGames();
        const finished = list.filter(g => g.status !== 'WAITING');
        setGames(finished);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to load games');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [loadUserGames]);

  const resultLabel = (game) => {
    if (!game.winnerId) return 'Draw';
    if (game.winnerId === user?.userId) return 'Win';
    return 'Loss';
  };

  const statusLabel = (status) => status.replace('DRAW_', 'DRAW ').replace('_', ' ');

  const Content = () => {
    if (loading) {
      return <LoadingSpinner size="large" message="Loading your games..." />;
    }

    if (error) {
      return <div className="history-error">{error}</div>;
    }

    if (!games.length) {
      return (
        <div className="history-empty">
          <h2>No completed games yet</h2>
          <p>Play a game to see your move history.</p>
          <button className="history-cta" onClick={() => navigate('/find-game')}>Find a game</button>
        </div>
      );
    }

    return (
      <>
        <div className="history-header">
          <div>
            <h1>Game History</h1>
            <p>Review your recent games and jump back into the move history.</p>
          </div>
          <button className="history-cta" onClick={() => navigate('/find-game')}>New game</button>
        </div>

        <div className="history-list">
          {games.map((game) => (
            <div key={game.id} className="history-card">
              <div className="history-top">
                <div className={`result-pill ${resultLabel(game).toLowerCase()}`}>{resultLabel(game)}</div>
                <div className="status-text">{statusLabel(game.status)}</div>
              </div>
              <div className="history-body">
                <div className="players">
                  <div className="player">
                    <span className="player-label">White</span>
                    <span className="player-name">{game.whitePlayer?.username || '—'}</span>
                  </div>
                  <div className="player">
                    <span className="player-label">Black</span>
                    <span className="player-name">{game.blackPlayer?.username || '—'}</span>
                  </div>
                </div>
                <div className="meta">
                  <span>{game.timeControl ? `${Math.floor(game.timeControl / 60)}+${game.timeIncrement || 0}` : 'Unlimited'}</span>
                  <span>{game.moves?.length || 0} moves</span>
                  <span>{game.endedAt ? new Date(game.endedAt).toLocaleString() : new Date(game.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="history-actions">
                <button className="secondary" onClick={() => navigate(`/game/${game.id}`)}>View game</button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="find-game-layout history-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 22H5V20H19V22M17 10C17 7.24 14.76 5 12 5S7 7.24 7 10C7 11.38 7.56 12.65 8.5 13.58L10 15.09V18H14V15.09L15.5 13.58C16.44 12.65 17 11.38 17 10M12 3C16.97 3 21 7.03 21 12C21 13.27 20.73 14.48 20.24 15.58L18.68 14.03C18.89 13.38 19 12.7 19 12C19 8.13 15.87 5 12 5S5 8.13 5 12C5 12.7 5.11 13.38 5.32 14.03L3.76 15.58C3.27 14.48 3 13.27 3 12C3 7.03 7.03 3 12 3Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-name">Chess Arena</div>
            <div className="brand-tagline">Master the game</div>
          </div>
        </div>

        <nav className="nav">
          <button onClick={() => navigate('/dashboard')} className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
            </svg>
            <span>Dashboard</span>
          </button>
          <button onClick={() => navigate('/find-game')} className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            <span>Find Game</span>
          </button>
          <button onClick={() => navigate('/leaderboard')} className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z" fill="currentColor"/>
            </svg>
            <span>Leaderboard</span>
          </button>
          <button onClick={() => navigate('/history')} className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor"/>
            </svg>
            <span>History</span>
          </button>
          <button onClick={() => navigate('/profile')} className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
            <span>Profile</span>
          </button>
          <button onClick={() => navigate('/settings')} className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
            </svg>
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      <main className="main-content history-page">
        <Content />
      </main>
    </div>
  );
};

export default History;
