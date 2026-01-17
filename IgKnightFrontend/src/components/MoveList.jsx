import React, { useState, useEffect, useRef } from 'react';
import './MoveList.css';

const MoveList = ({ moves, currentMoveIndex, onMoveClick, onExportPGN }) => {
  const [hoveredMove, setHoveredMove] = useState(null);
  const scrollRef = useRef(null);

  // Group moves into pairs (white, black)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
      whiteIndex: i,
      blackIndex: i + 1
    });
  }

  const handleMoveClick = (index) => {
    if (onMoveClick) {
      onMoveClick(index);
    }
  };

  const exportToPGN = () => {
    if (!moves || moves.length === 0) return;

    // Build PGN format
    let pgn = '';
    
    // PGN headers (basic)
    pgn += '[Event "IgKnight Game"]\n';
    pgn += `[Date "${new Date().toISOString().split('T')[0]}"]\n`;
    pgn += '[White "Player1"]\n';
    pgn += '[Black "Player2"]\n';
    pgn += '\n';

    // Moves
    for (let i = 0; i < movePairs.length; i++) {
      const pair = movePairs[i];
      const whiteSan = pair.white.san || pair.white.sanNotation || pair.white.notation || `${pair.white.from}${pair.white.to}`;
      pgn += `${pair.moveNumber}. ${whiteSan}`;
      if (pair.black) {
        const blackSan = pair.black.san || pair.black.sanNotation || pair.black.notation || `${pair.black.from}${pair.black.to}`;
        pgn += ` ${blackSan}`;
      }
      pgn += ' ';
      
      // Line break every 5 move pairs for readability
      if ((i + 1) % 5 === 0) {
        pgn += '\n';
      }
    }

    // Download PGN file
    const blob = new Blob([pgn], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-${Date.now()}.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onExportPGN) {
      onExportPGN(pgn);
    }
  };

  const copyPGN = () => {
    if (!moves || moves.length === 0) return;

    let pgn = '';
    for (let i = 0; i < movePairs.length; i++) {
      const pair = movePairs[i];
      const whiteSan = pair.white.san || pair.white.sanNotation || pair.white.notation || `${pair.white.from}${pair.white.to}`;
      pgn += `${pair.moveNumber}. ${whiteSan}`;
      if (pair.black) {
        const blackSan = pair.black.san || pair.black.sanNotation || pair.black.notation || `${pair.black.from}${pair.black.to}`;
        pgn += ` ${blackSan}`;
      }
      pgn += ' ';
    }

    navigator.clipboard.writeText(pgn).then(() => {
      // Could show a toast here
      console.log('PGN copied to clipboard');
    });
  };

  // Auto-scroll to bottom when new moves arrive unless user is viewing history
  useEffect(() => {
    if (!scrollRef.current) return;
    // If user is at bottom or we're following live, scroll to bottom
    const el = scrollRef.current;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (isNearBottom || currentMoveIndex === moves.length - 1) {
      el.scrollTop = el.scrollHeight;
    }
  }, [moves, currentMoveIndex]);

  return (
    <div className="move-list-container">
      <div className="move-list-header">
        <h3>Move History</h3>
        {moves && moves.length > 0 && (
          <div className="move-list-actions">
            <button
              className="move-action-btn"
              onClick={copyPGN}
              title="Copy PGN to clipboard"
              aria-label="Copy PGN"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
            <button
              className="move-action-btn"
              onClick={exportToPGN}
              title="Export PGN file"
              aria-label="Download PGN"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="move-list-scroll" ref={scrollRef}>
        {moves && moves.length > 0 ? (
          <div className="move-pairs">
            {movePairs.map((pair) => (
              <div key={pair.moveNumber} className="move-pair">
                <div className="move-number">{pair.moveNumber}.</div>
                <button
                  className={`move-btn ${currentMoveIndex === pair.whiteIndex ? 'current' : ''} ${hoveredMove === pair.whiteIndex ? 'hovered' : ''}`}
                  onClick={() => handleMoveClick(pair.whiteIndex)}
                  onMouseEnter={() => setHoveredMove(pair.whiteIndex)}
                  onMouseLeave={() => setHoveredMove(null)}
                  aria-label={`Move ${pair.moveNumber}, white: ${pair.white.san || pair.white.sanNotation || pair.white.notation || `${pair.white.from}${pair.white.to}`}`}
                >
                  {pair.white.san || pair.white.sanNotation || pair.white.notation || `${pair.white.from}${pair.white.to}`}
                </button>
                {pair.black && (
                  <button
                    className={`move-btn ${currentMoveIndex === pair.blackIndex ? 'current' : ''} ${hoveredMove === pair.blackIndex ? 'hovered' : ''}`}
                    onClick={() => handleMoveClick(pair.blackIndex)}
                    onMouseEnter={() => setHoveredMove(pair.blackIndex)}
                    onMouseLeave={() => setHoveredMove(null)}
                    aria-label={`Move ${pair.moveNumber}, black: ${pair.black.san || pair.black.sanNotation || pair.black.notation || `${pair.black.from}${pair.black.to}`}`}
                  >
                    {pair.black.san || pair.black.sanNotation || pair.black.notation || `${pair.black.from}${pair.black.to}`}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-moves">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm3-4H6v-2h9v2zm0-4H6V7h9v2z"/>
            </svg>
            <p>No moves yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoveList;
