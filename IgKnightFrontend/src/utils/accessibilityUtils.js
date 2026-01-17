/**
 * Utility function to announce messages to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announce = (message, priority = 'polite') => {
  const announcer = document.getElementById('announcements');
  if (!announcer) return;

  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
};

/**
 * Get chess notation for a square
 * @param {number} rank - Rank (0-7)
 * @param {number} file - File (0-7)
 * @returns {string} Chess notation (e.g., "e4")
 */
export const getSquareNotation = (rank, file) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return `${files[file]}${rank + 1}`;
};

/**
 * Get descriptive text for a chess piece
 * @param {Object} piece - Piece object with color and type
 * @returns {string} Descriptive text (e.g., "White Knight")
 */
export const getPieceDescription = (piece) => {
  if (!piece) return 'empty square';
  const color = piece.color === 'WHITE' ? 'White' : 'Black';
  return `${color} ${piece.type.toLowerCase()}`;
};

/**
 * Generate accessible move description
 * @param {Object} move - Move object
 * @returns {string} Move description for screen readers
 */
export const getMoveDescription = (move) => {
  const { piece, from, to, captured, check, checkmate } = move;
  const pieceDesc = getPieceDescription(piece);
  const fromSquare = getSquareNotation(from.rank, from.file);
  const toSquare = getSquareNotation(to.rank, to.file);
  
  let description = `${pieceDesc} moves from ${fromSquare} to ${toSquare}`;
  
  if (captured) {
    description += `, captures ${getPieceDescription(captured)}`;
  }
  
  if (checkmate) {
    description += ', checkmate!';
  } else if (check) {
    description += ', check';
  }
  
  return description;
};

/**
 * Format time for screen readers
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTimeForScreenReader = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
};
