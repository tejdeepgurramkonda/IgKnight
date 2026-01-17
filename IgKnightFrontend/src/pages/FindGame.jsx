import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import './FindGame.css';

const FindGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { createGame, loadActiveGames } = useGame();
  const toast = useToast();
  
  const [creatingGame, setCreatingGame] = useState(false);
  const [timeControl, setTimeControl] = useState('10+0');
  const [selectedColor, setSelectedColor] = useState('random');
  const [openChallenges, setOpenChallenges] = useState([]);
  const [friendsOnline, setFriendsOnline] = useState([]);
  const [playersOnline] = useState(2086); // This would come from backend WebSocket
  
  // All time controls for Quick Play (shown in 2-column grid)
  const quickPlayModes = [
    { time: '1+0', timeControl: 60, increment: 0, type: 'Bullet', players: 234, waitTime: '~5s', icon: '⚡' },
    { time: '2+1', timeControl: 120, increment: 1, type: 'Bullet', players: 156, waitTime: '~8s', icon: '⚡' },
    { time: '3+0', timeControl: 180, increment: 0, type: 'Blitz', players: 421, waitTime: '~3s', icon: '🔥' },
    { time: '3+2', timeControl: 180, increment: 2, type: 'Blitz', players: 389, waitTime: '~4s', icon: '🔥' },
    { time: '5+0', timeControl: 300, increment: 0, type: 'Blitz', players: 312, waitTime: '~6s', icon: '🔥' },
    { time: '10+0', timeControl: 600, increment: 0, type: 'Rapid', players: 287, waitTime: '~12s', icon: '⏱️' },
    { time: '15+10', timeControl: 900, increment: 10, type: 'Rapid', players: 198, waitTime: '~18s', icon: '⏱️' },
    { time: '30+0', timeControl: 1800, increment: 0, type: 'Classical', players: 89, waitTime: '~45s', icon: '♟️' },
  ];

  useEffect(() => {
    loadOpenChallenges();
    loadFriends();
  }, []);

  const loadOpenChallenges = async () => {
    try {
      // This would fetch from backend - for now using mock data
      // In real implementation: const challenges = await gameApi.getOpenChallenges();
      const mockChallenges = [
        {
          id: 1,
          username: 'ChessMaster42',
          rating: 1520,
          timeControl: '10+0',
          gameType: 'Rated',
          color: 'white',
          avatar: 'C'
        },
        {
          id: 2,
          username: 'KnightRush',
          rating: 1485,
          timeControl: '3+2',
          gameType: 'Rated',
          color: 'black',
          avatar: 'K'
        },
        {
          id: 3,
          username: 'QueenAttack',
          rating: 1555,
          timeControl: '5+0',
          gameType: 'Casual',
          color: 'random',
          avatar: 'Q'
        },
        {
          id: 4,
          username: 'PawnStorm99',
          rating: 1430,
          timeControl: '10+0',
          gameType: 'Rated',
          color: 'white',
          avatar: 'P'
        },
        {
          id: 5,
          username: 'RookMaster',
          rating: 1502,
          timeControl: '15+10',
          gameType: 'Rated',
          color: 'black',
          avatar: 'R'
        },
      ];
      setOpenChallenges(mockChallenges);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    }
  };

  const loadFriends = async () => {
    try {
      // This would fetch from backend - for now using mock data
      const mockFriends = [
        { id: 1, username: 'BestFriend123', status: 'Playing', avatar: 'B' },
        { id: 2, username: 'ChessBuddy', status: 'Online', avatar: 'C' },
        { id: 3, username: 'OldRival', status: 'In Lobby', avatar: 'O' },
      ];
      setFriendsOnline(mockFriends);
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  };

  const handleQuickPlay = async (mode) => {
    if (creatingGame) return;
    
    try {
      setCreatingGame(true);
      const game = await createGame(mode.timeControl, mode.increment, true);
      navigate(`/game/${game.id}`);
    } catch (err) {
      console.error('Failed to create game:', err);
      toast.error(err.response?.data?.error || 'Failed to create game');
    } finally {
      setCreatingGame(false);
    }
  };

  const handleCreateChallenge = async () => {
    if (creatingGame) return;
    
    try {
      setCreatingGame(true);
      
      // Parse time control (e.g., "10+0")
      const [minutes, increment] = timeControl.split('+').map(num => parseInt(num.trim()));
      const timeInSeconds = minutes * 60;
      
      const game = await createGame(timeInSeconds, increment, false);
      navigate(`/game/${game.id}`);
    } catch (err) {
      console.error('Failed to create challenge:', err);
      toast.error(err.response?.data?.error || 'Failed to create challenge');
    } finally {
      setCreatingGame(false);
    }
  };

  const handleAcceptChallenge = async (challengeId) => {
    try {
      // In real implementation: await gameApi.acceptChallenge(challengeId);
      navigate(`/game/${challengeId}`);
    } catch (err) {
      console.error('Failed to accept challenge:', err);
      toast.error('Failed to accept challenge');
    }
  };

  const handleChallengeFriend = (friendId) => {
    // This would open a challenge dialog or navigate to create challenge for specific user
    console.log('Challenge friend:', friendId);
  };

  const handleRefreshChallenges = () => {
    loadOpenChallenges();
  };

  return (
    <div className="find-game-layout">
      {/* Sidebar */}
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
          <button onClick={() => navigate('/find-game')} className="nav-item active">
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
          <button onClick={() => navigate('/history')} className="nav-item">
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

      {/* Main Content */}
      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Find a Game</h1>
          <p className="page-subtitle">Choose your time control and start playing</p>
        </div>

        {/* Two Column Layout */}
        <div className="content-grid">
          {/* Left: Quick Play Section */}
          <section className="quick-play-section">
            <div className="section-header">
              <h2 className="section-title">Quick Play</h2>
              <div className="players-online-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span>{playersOnline} players online</span>
              </div>
            </div>

            <div className="quick-play-grid">
              {quickPlayModes.map((mode, index) => (
                <button
                  key={index}
                  className="quick-play-card"
                  onClick={() => handleQuickPlay(mode)}
                  disabled={creatingGame}
                >
                  <div className="mode-header">
                    <div className="mode-icon">{mode.icon}</div>
                    <div className="mode-info">
                      <div className="mode-type">{mode.type}</div>
                      <div className="mode-time">{mode.time}</div>
                    </div>
                  </div>
                  <div className="mode-stats">
                    <span className="mode-stat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                      {mode.players}
                    </span>
                    <span className="mode-stat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      {mode.waitTime}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Right: Create Challenge & Friends */}
          <div className="right-sidebar">
            {/* Create Challenge */}
            <section className="create-challenge-section">
              <h2 className="section-title">Create Challenge</h2>
              
              <div className="challenge-form">
                <div className="form-group">
                  <label className="form-label">Time Control</label>
                  <input
                    type="text"
                    className="form-input"
                    value={timeControl}
                    onChange={(e) => setTimeControl(e.target.value)}
                    placeholder="e.g. 10+0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Color</label>
                  <div className="color-selector">
                    <button
                      className={`color-option ${selectedColor === 'white' ? 'active' : ''}`}
                      onClick={() => setSelectedColor('white')}
                    >
                      <div className="color-circle white"></div>
                    </button>
                    <button
                      className={`color-option ${selectedColor === 'random' ? 'active' : ''}`}
                      onClick={() => setSelectedColor('random')}
                    >
                      <div className="color-circle random"></div>
                    </button>
                    <button
                      className={`color-option ${selectedColor === 'black' ? 'active' : ''}`}
                      onClick={() => setSelectedColor('black')}
                    >
                      <div className="color-circle black"></div>
                    </button>
                  </div>
                </div>

                <button
                  className="create-challenge-btn"
                  onClick={handleCreateChallenge}
                  disabled={creatingGame}
                >
                  Create Challenge
                </button>
              </div>
            </section>

            {/* Friends Online */}
            <section className="friends-section">
              <h2 className="section-title">Friends Online</h2>
              
              <div className="friends-list">
                {friendsOnline.map(friend => (
                  <div key={friend.id} className="friend-item">
                    <div className="friend-avatar">{friend.avatar}</div>
                    <div className="friend-info">
                      <div className="friend-name">{friend.username}</div>
                      <div className={`friend-status ${friend.status.toLowerCase().replace(' ', '-')}`}>
                        <span className="status-indicator"></span>
                        {friend.status}
                      </div>
                    </div>
                    <button
                      className="challenge-friend-btn"
                      onClick={() => handleChallengeFriend(friend.id)}
                    >
                      Challenge
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Section - Open Challenges & Tournament */}
        <div className="bottom-section-grid">
          {/* Open Challenges Section */}
          <section className="open-challenges-section">
            <div className="section-header">
              <h2 className="section-title">Open Challenges</h2>
              <button className="refresh-btn" onClick={handleRefreshChallenges}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
                Refresh
              </button>
            </div>
            <div className="challenges-list">
              <div className="challenge-card">
                <div className="challenge-player-info">
                  <div className="challenge-avatar">C</div>
                  <div className="challenge-details">
                    <div className="challenge-username">
                      ChessMaster42 <span className="challenge-rating">(1520)</span>
                    </div>
                    <div className="challenge-meta">
                      <span className="challenge-time-badge">10+0</span>
                      <span className="challenge-type-badge rated">Rated</span>
                      <div className="challenge-color-indicator white"></div>
                    </div>
                  </div>
                </div>
                <button className="accept-challenge-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Accept
                </button>
              </div>

              <div className="challenge-card">
                <div className="challenge-player-info">
                  <div className="challenge-avatar">K</div>
                  <div className="challenge-details">
                    <div className="challenge-username">
                      KnightRush <span className="challenge-rating">(1485)</span>
                    </div>
                    <div className="challenge-meta">
                      <span className="challenge-time-badge">3+2</span>
                      <span className="challenge-type-badge rated">Rated</span>
                      <div className="challenge-color-indicator white"></div>
                    </div>
                  </div>
                </div>
                <button className="accept-challenge-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Accept
                </button>
              </div>

              <div className="challenge-card">
                <div className="challenge-player-info">
                  <div className="challenge-avatar">Q</div>
                  <div className="challenge-details">
                    <div className="challenge-username">
                      QueenAttack <span className="challenge-rating">(1555)</span>
                    </div>
                    <div className="challenge-meta">
                      <span className="challenge-time-badge">5+0</span>
                      <span className="challenge-type-badge casual">Casual</span>
                      <div className="challenge-color-indicator random"></div>
                    </div>
                  </div>
                </div>
                <button className="accept-challenge-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Accept
                </button>
              </div>

              <div className="challenge-card">
                <div className="challenge-player-info">
                  <div className="challenge-avatar">P</div>
                  <div className="challenge-details">
                    <div className="challenge-username">
                      PawnStorm99 <span className="challenge-rating">(1430)</span>
                    </div>
                    <div className="challenge-meta">
                      <span className="challenge-time-badge">10+0</span>
                      <span className="challenge-type-badge rated">Rated</span>
                      <div className="challenge-color-indicator white"></div>
                    </div>
                  </div>
                </div>
                <button className="accept-challenge-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Accept
                </button>
              </div>

              <div className="challenge-card">
                <div className="challenge-player-info">
                  <div className="challenge-avatar">R</div>
                  <div className="challenge-details">
                    <div className="challenge-username">
                      RookMaster <span className="challenge-rating">(1502)</span>
                    </div>
                    <div className="challenge-meta">
                      <span className="challenge-time-badge">15+10</span>
                      <span className="challenge-type-badge rated">Rated</span>
                      <div className="challenge-color-indicator black"></div>
                    </div>
                  </div>
                </div>
                <button className="accept-challenge-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Accept
                </button>
              </div>
            </div>
          </section>

          {/* Live Tournament Section */}
          <section className="tournament-section">
            <div className="tournament-banner">
              <div className="tournament-icon">🏆</div>
              <h2 className="tournament-title">Live Tournament</h2>
              <p className="tournament-description">Weekly Blitz Championship starts in 2 hours!</p>
              <button className="tournament-register-btn">Register Now</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FindGame;
