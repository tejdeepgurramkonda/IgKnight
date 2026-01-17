export const PIECE_UNICODE = {
  'WHITE_KING': '♔',
  'WHITE_QUEEN': '♕',
  'WHITE_ROOK': '♖',
  'WHITE_BISHOP': '♗',
  'WHITE_KNIGHT': '♘',
  'WHITE_PAWN': '♙',
  'BLACK_KING': '♚',
  'BLACK_QUEEN': '♛',
  'BLACK_ROOK': '♜',
  'BLACK_BISHOP': '♝',
  'BLACK_KNIGHT': '♞',
  'BLACK_PAWN': '♟',
};

export const fenToPiece = (fenChar) => {
  const pieceMap = {
    'K': 'WHITE_KING',
    'Q': 'WHITE_QUEEN',
    'R': 'WHITE_ROOK',
    'B': 'WHITE_BISHOP',
    'N': 'WHITE_KNIGHT',
    'P': 'WHITE_PAWN',
    'k': 'BLACK_KING',
    'q': 'BLACK_QUEEN',
    'r': 'BLACK_ROOK',
    'b': 'BLACK_BISHOP',
    'n': 'BLACK_KNIGHT',
    'p': 'BLACK_PAWN',
  };
  return pieceMap[fenChar] || null;
};

export const parseFEN = (fen) => {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  const [position] = fen.split(' ');
  const ranks = position.split('/');

  ranks.forEach((rank, rankIndex) => {
    let fileIndex = 0;
    for (const char of rank) {
      if (isNaN(char)) {
        board[rankIndex][fileIndex] = fenToPiece(char);
        fileIndex++;
      } else {
        fileIndex += parseInt(char);
      }
    }
  });

  return board;
};

export const algebraicToIndices = (algebraic) => {
  const file = algebraic.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(algebraic[1]);
  return { rank, file };
};

export const indicesToAlgebraic = (rank, file) => {
  const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
  const rankNum = 8 - rank;
  return `${fileChar}${rankNum}`;
};
