import React from 'react';
import { PIECE_UNICODE } from '../utils/chessUtils';
import './Piece.css';

const Piece = ({ piece, isDragging }) => {
  if (!piece) return null;

  const isWhitePiece = piece.startsWith('WHITE');
  
  return (
    <div className={`chess-piece ${isDragging ? 'dragging' : ''} ${isWhitePiece ? 'white-piece' : 'black-piece'}`}>
      {PIECE_UNICODE[piece]}
    </div>
  );
};

export default Piece;
