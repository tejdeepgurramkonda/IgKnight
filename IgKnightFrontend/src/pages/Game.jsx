import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { useGameSound } from '../context/SoundContext';
import { useGameWebSocket } from '../hooks/useGameWebSocket';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';
import Board from '../components/Board';
import Timer from '../components/Timer';
import SoundToggle from '../components/SoundToggle';
import MoveList from '../components/MoveList';
import { Modal, Button } from '../components/ui';
import './Game.css';

const Game = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const sound = useGameSound();
  const { currentGame, loadGame, makeMove, resignGame, updateCurrentGame, joinGame, getLegalMoves } = useGame();
  const [clockSnapshot, setClockSnapshot] = useState(null);
  const [error, setError] = useState(null);
  const [playerColor, setPlayerColor] = useState('WHITE');
  const [kingSquare, setKingSquare] = useState(null);
  const [whiteTime, setWhiteTime] = useState(null);
  const [blackTime, setBlackTime] = useState(null);
  const [lastMoveCount, setLastMoveCount] = useState(0);
  const [lastTurnChange, setLastTurnChange] = useState(null);
  const [showResignModal, setShowResignModal] = useState(false);
  const [gameStartSoundPlayed, setGameStartSoundPlayed] = useState(false);
  const [viewingMoveIndex, setViewingMoveIndex] = useState(null);
  const [viewingPosition, setViewingPosition] = useState(null);

  const handleGameUpdate = useCallback((gameData) => {
    updateCurrentGame(gameData);
    if (gameData.whiteTimeRemaining !== undefined) {
      setWhiteTime(gameData.whiteTimeRemaining);
    }
    if (gameData.blackTimeRemaining !== undefined) {
      setBlackTime(gameData.blackTimeRemaining);
    }
    if (gameData.whiteTimeRemaining !== undefined && gameData.blackTimeRemaining !== undefined) {
      setClockSnapshot({
        white: gameData.whiteTimeRemaining,
        black: gameData.blackTimeRemaining,
        turn: gameData.currentTurn,
        syncedAt: Date.now(),
      });
    }
  }, [updateCurrentGame]);

  const handleMoveReceived = useCallback((moveData) => {
    console.log('Move received:', moveData);
    const notation = moveData.san || moveData.moveNotation || '';

    if (notation.includes('x')) {
      sound.playCapture();
    } else if (notation === 'O-O' || notation === 'O-O-O') {
      sound.playCastle();
    } else if (notation.includes('=')) {
      sound.playPromotion();
    } else {
      sound.playMove();
    }

    if (typeof moveData.whiteTimeRemaining === 'number') {
      setWhiteTime(moveData.whiteTimeRemaining);
    }
    if (typeof moveData.blackTimeRemaining === 'number') {
      setBlackTime(moveData.blackTimeRemaining);
    }

    if (typeof moveData.whiteTimeRemaining === 'number' && typeof moveData.blackTimeRemaining === 'number') {
      setClockSnapshot({
        white: moveData.whiteTimeRemaining,
        black: moveData.blackTimeRemaining,
        turn: moveData.currentTurn,
        syncedAt: Date.now(),
      });
    }

    if (moveData.isCheck && !moveData.isCheckmate) {
      setTimeout(() => sound.playCheck(), 100);
    }
  }, [sound]);

  const handleGameEnd = useCallback((endData) => {
    console.log('Game ended:', endData);
    if (typeof endData?.whiteTimeRemaining === 'number') {
      setWhiteTime(endData.whiteTimeRemaining);
    }
    if (typeof endData?.blackTimeRemaining === 'number') {
      setBlackTime(endData.blackTimeRemaining);
    }
    if (typeof endData?.whiteTimeRemaining === 'number' && typeof endData?.blackTimeRemaining === 'number') {
      setClockSnapshot({
        white: endData.whiteTimeRemaining,
        black: endData.blackTimeRemaining,
        turn: endData.currentTurn,
        syncedAt: Date.now(),
      });
    }
  }, []);

  const { connected, sendMove, resignGame: wsResignGame } = useGameWebSocket(
    gameId,
    handleGameUpdate,
    handleMoveReceived,
    handleGameEnd
  );

  useEffect(() => {
    let initialGameStatus = null;
    let isCreatorAtMount = false;
    
    const initGame = async () => {
      if (!gameId || !user) return;
      
      try {
        // Load the game first
        const game = await loadGame(gameId);
        
        // Capture initial status for cleanup
        initialGameStatus = game.status;
        isCreatorAtMount = game.whitePlayer?.id === user.userId;
        
        // Only try to join if:
        // 1. Game is waiting for players
        // 2. User is not already a player (neither white nor black)
        const isWhitePlayer = game.whitePlayer?.id === user.userId;
        const isBlackPlayer = game.blackPlayer?.id === user.userId;
        
        if (game.status === 'WAITING' && !isWhitePlayer && !isBlackPlayer) {
          try {
            const updatedGame = await joinGame(gameId);
            console.log('Successfully joined game:', updatedGame);
            // Update status after joining
            initialGameStatus = updatedGame.status;
          } catch (joinErr) {
            // If join fails (maybe game full), that's okay
            console.log('Could not join game:', joinErr.response?.data?.error || joinErr.message);
          }
        }
      } catch (err) {
        setError('Failed to load game');
        console.error(err);
      }
    };
    
    initGame();

    // Cleanup: Delete WAITING game when leaving the page
    return () => {
      // Only cleanup if game was WAITING when we mounted and user was the creator
      if (initialGameStatus === 'WAITING' && isCreatorAtMount && user) {
        resignGame(gameId).catch(err => {
          // Silently fail - game might already be deleted or joined
          console.log('Cleanup skipped:', err.response?.status);
        });
      }
    };
  }, [gameId, user, loadGame, joinGame, resignGame]);

  useEffect(() => {
    if (currentGame && user) {
      // Determine player color
      if (currentGame.whitePlayer?.id === user.userId) {
        setPlayerColor('WHITE');
      } else if (currentGame.blackPlayer?.id === user.userId) {
        setPlayerColor('BLACK');
      }

      // Sync clocks from server state
      setWhiteTime(currentGame.whiteTimeRemaining);
      setBlackTime(currentGame.blackTimeRemaining);
      setLastTurnChange(currentGame.currentTurn);

      // Find king square if in check
      if (currentGame.isCheck) {
        findKingSquare(currentGame.fenPosition, currentGame.currentTurn);
      } else {
        setKingSquare(null);
      }

      // Play game start sound when game transitions to IN_PROGRESS
      if (currentGame.status === 'IN_PROGRESS' && !gameStartSoundPlayed) {
        sound.playGameStart();
        setGameStartSoundPlayed(true);
      }

      // Play game end sound when game ends
      if ((currentGame.status === 'CHECKMATE' || currentGame.status === 'DRAW' || 
           currentGame.status === 'RESIGNED' || currentGame.status === 'TIMEOUT') && 
          lastMoveCount > 0) {
        if (currentGame.status === 'CHECKMATE') {
          sound.playCheckmate();
        } else {
          sound.playGameEnd();
        }
      }
    }
  }, [currentGame, user, lastTurnChange, gameStartSoundPlayed, lastMoveCount, sound]);

  // Countdown timer
  useEffect(() => {
    if (!currentGame || currentGame.status !== 'IN_PROGRESS' || !currentGame.timeControl) {
      return;
    }

    const interval = setInterval(() => {
      if (!clockSnapshot) return;
      const elapsed = Math.floor((Date.now() - clockSnapshot.syncedAt) / 1000);
      const white = clockSnapshot.turn === 'WHITE'
        ? Math.max(clockSnapshot.white - elapsed, 0)
        : clockSnapshot.white;
      const black = clockSnapshot.turn === 'BLACK'
        ? Math.max(clockSnapshot.black - elapsed, 0)
        : clockSnapshot.black;
      setWhiteTime(white);
      setBlackTime(black);
    }, 500);

    return () => clearInterval(interval);
  }, [currentGame, clockSnapshot]);

  const findKingSquare = (fen, turn) => {
    const [position] = fen.split(' ');
    const ranks = position.split('/');
    const kingChar = turn === 'WHITE' ? 'K' : 'k';

    for (let rank = 0; rank < 8; rank++) {
      let file = 0;
      for (const char of ranks[rank]) {
        if (char === kingChar) {
          const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
          const rankNum = 8 - rank;
          setKingSquare(`${fileChar}${rankNum}`);
          return;
        }
        if (isNaN(char)) {
          file++;
        } else {
          file += parseInt(char);
        }
      }
    }
  };

  const handleMove = async (from, to, promotion) => {
    try {
      setError(null);
      console.log('Making move:', { from, to, promotion });
      if (connected) {
        sendMove(from, to, promotion);
      } else {
        await makeMove(gameId, from, to, promotion);
      }
      // Sound will be played in the move received handler
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Invalid move';
      setError(errorMsg);
      console.error('Move error:', err.response?.data || err);
      toast.error(errorMsg);
      sound.playError();
    }
  };

  const handleResign = async () => {
    try {
      await resignGame(gameId);
      setShowResignModal(false);
      toast.success('Game resigned');
    } catch (err) {
      setError('Failed to resign');
      console.error('Resign error:', err);
      toast.error('Failed to resign game');
    }
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: () => {
      if (showResignModal) {
        setShowResignModal(false);
      } else if (viewingMoveIndex !== null) {
        // Return to current position
        setViewingMoveIndex(null);
        setViewingPosition(null);
      }
    },
    onArrowMove: (direction) => {
      if (!currentGame?.moves || currentGame.moves.length === 0) return;
      
      const currentIndex = viewingMoveIndex ?? currentGame.moves.length - 1;
      
      if (direction === 'left' && currentIndex > 0) {
        handleMoveNavigation(currentIndex - 1);
      } else if (direction === 'right' && currentIndex < currentGame.moves.length - 1) {
        handleMoveNavigation(currentIndex + 1);
      } else if (direction === 'right' && currentIndex === currentGame.moves.length - 1) {
        // Return to current position
        setViewingMoveIndex(null);
        setViewingPosition(null);
      }
    },
    disabled: !currentGame || currentGame.status !== 'IN_PROGRESS'
  });

  const handleMoveNavigation = (moveIndex) => {
    if (!currentGame?.moves || moveIndex < 0 || moveIndex >= currentGame.moves.length) {
      return;
    }

    setViewingMoveIndex(moveIndex);
    const move = currentGame.moves[moveIndex];
    
    // Set the FEN position after this move
    if (move.resultingFen) {
      setViewingPosition(move.resultingFen);
    }
  };

  const returnToCurrentPosition = () => {
    setViewingMoveIndex(null);
    setViewingPosition(null);
  };

  const isPlayerTurn = () => {
    if (!currentGame || !user) return false;
    const isWhite = currentGame.whitePlayer?.id === user.userId;
    const isBlack = currentGame.blackPlayer?.id === user.userId;
    const currentTurn = currentGame.currentTurn;
    return (isWhite && currentTurn === 'WHITE') || (isBlack && currentTurn === 'BLACK');
  };

  const getGameStatus = () => {
    if (!currentGame) return '';
    
    const status = currentGame.status;
    if (status === 'WAITING') return 'Waiting for opponent...';
    if (status === 'IN_PROGRESS') {
      if (currentGame.isCheck) {
        return `${currentGame.currentTurn} is in check!`;
      }
      return `${currentGame.currentTurn}'s turn`;
    }
    if (status === 'CHECKMATE') {
      const winner = currentGame.winnerId === currentGame.whitePlayer?.id ? 'White' : 'Black';
      return `Checkmate! ${winner} wins!`;
    }
    if (status === 'STALEMATE') return 'Stalemate - Draw';
    if (status === 'RESIGNATION') {
      const winner = currentGame.winnerId === currentGame.whitePlayer?.id ? 'White' : 'Black';
      return `${winner} wins by resignation`;
    }
    if (status === 'TIMEOUT') {
      const winner = currentGame.winnerId === currentGame.whitePlayer?.id ? 'White' : 'Black';
      return `${winner} wins on time`;
    }
    if (status.startsWith('DRAW_')) return `Draw - ${status.replace('DRAW_', '')}`;
    
    return status;
  };

  if (!currentGame) {
    return (
      <div className="game-container">
        <div className="loading">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {/* Left Sidebar */}
      <div className="game-sidebar-left">
        <div className="game-header">
          <div>
            <h1>Live Game</h1>
            <p className="game-subtitle">
              {currentGame.timeControl ? `${currentGame.timeControl / 60}+${currentGame.timeIncrement || 0} Rapid Chess` : 'Unlimited'}
            </p>
          </div>
          <SoundToggle />
        </div>
      </div>

      {/* Center - Chess Board */}
      <div className="game-center">
        <div className="players-timer-row">
          <div className="player-card">
            <div className="player-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="player-details">
              <div className="player-name">
                {playerColor === 'WHITE' 
                  ? currentGame.blackPlayer?.username || 'Waiting...' 
                  : currentGame.whitePlayer?.username}
              </div>
              <div className="player-rating">1500</div>
            </div>
            {currentGame.timeControl && (
              <Timer 
                timeInSeconds={playerColor === 'WHITE' ? blackTime : whiteTime}
                isActive={currentGame.currentTurn !== playerColor && currentGame.status === 'IN_PROGRESS'}
                isLowTime={(playerColor === 'WHITE' ? blackTime : whiteTime) <= 30}
              />
            )}
          </div>

          <div className="player-card highlighted">
            <div className="player-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div className="player-details">
              <div className="player-name">
                {playerColor === 'WHITE' 
                  ? currentGame.whitePlayer?.username 
                  : currentGame.blackPlayer?.username || 'Waiting...'}
              </div>
              <div className="player-rating">1450</div>
            </div>
            {currentGame.timeControl && (
              <Timer 
                timeInSeconds={playerColor === 'WHITE' ? whiteTime : blackTime}
                isActive={currentGame.currentTurn === playerColor && currentGame.status === 'IN_PROGRESS'}
                isLowTime={(playerColor === 'WHITE' ? whiteTime : blackTime) <= 30}
              />
            )}
          </div>
        </div>
        
        <div className={`board-wrapper ${viewingMoveIndex !== null ? 'viewing-history' : ''}`}>
          <Board
            fen={viewingPosition || currentGame.fenPosition}
            playerColor={playerColor}
            onMove={handleMove}
            isCheck={currentGame.isCheck && viewingMoveIndex === null}
            checkKingSquare={viewingMoveIndex === null ? kingSquare : null}
            disabled={viewingMoveIndex !== null || !isPlayerTurn() || currentGame.status !== 'IN_PROGRESS'}
            gameId={gameId}
            onGetLegalMoves={getLegalMoves}
            lastMove={currentGame.moves && currentGame.moves.length > 0 ? {
              from: currentGame.moves[currentGame.moves.length - 1].from,
              to: currentGame.moves[currentGame.moves.length - 1].to,
            } : null}
          />
          {viewingMoveIndex !== null && (
            <div className="board-history-overlay">
              <div className="history-hint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Use ← → arrows or click moves to navigate
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="game-sidebar-right">
        {viewingMoveIndex !== null && (
          <div className="viewing-history-banner">
            <div className="banner-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
              <span>Viewing move {viewingMoveIndex + 1}</span>
            </div>
            <button className="return-btn" onClick={returnToCurrentPosition}>
              Return to current
            </button>
          </div>
        )}
        
        <MoveList
          moves={currentGame.moves || []}
          currentMoveIndex={viewingMoveIndex ?? (currentGame.moves?.length - 1)}
          onMoveClick={handleMoveNavigation}
        />

        <div className="game-info-panel">
          <div className="game-actions">
            <button className="btn-new-game" onClick={() => navigate('/dashboard')}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              New Game
            </button>
            
            {currentGame.status === 'IN_PROGRESS' && (
              <button className="btn-resign" onClick={() => setShowResignModal(true)}>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3v8h8L8.5 8.5l4.5-4.5L11.5 2.5 7 7 3 3zm18 18v-8h-8l2.5 2.5-4.5 4.5 1.5 1.5L17 17l4 4z"/>
                </svg>
                Resign
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Resign Confirmation Modal */}
      <Modal
        isOpen={showResignModal}
        onClose={() => setShowResignModal(false)}
        title="Resign Game"
        size="small"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowResignModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleResign}>
              Yes, Resign
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Are you sure you want to resign this game? This action cannot be undone and you will lose the match.
        </p>
      </Modal>
    </div>
  );
};

const formatTime = (seconds) => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default Game;
