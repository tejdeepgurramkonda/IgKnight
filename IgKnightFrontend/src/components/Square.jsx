import React from 'react';
import Piece from './Piece';
import './Square.css';

const Square = ({ 
  rank, 
  file, 
  piece, 
  isLight, 
  isSelected, 
  isLegalMove, 
  isLastMove,
  isCheck,
  onClick,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const squareClass = `chess-square ${isLight ? 'light' : 'dark'} ${isSelected ? 'selected' : ''} ${isLegalMove ? 'legal-move' : ''} ${isLastMove ? 'last-move' : ''} ${isCheck ? 'check' : ''}`;

  const squareName = `${String.fromCharCode(97 + file)}${rank + 1}`;

  const derivePieceMeta = () => {
    if (!piece || typeof piece !== 'string') return null;
    const [color, type] = piece.split('_');
    if (!color || !type) return null;
    return { color: color === 'WHITE' ? 'White' : 'Black', type: type.toLowerCase() };
  };

  const getAriaLabel = () => {
    const meta = derivePieceMeta();
    let label = `Square ${squareName}`;
    if (meta) {
      label += `, ${meta.color} ${meta.type}`;
    } else {
      label += ', empty';
    }
    if (isSelected) label += ', selected';
    if (isLegalMove) label += ', valid move';
    if (isLastMove) label += ', last move';
    if (isCheck) label += ', king in check';
    return label;
  };

  return (
    <div
      className={squareClass}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      draggable={false}
      role="gridcell"
      aria-label={getAriaLabel()}
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
        >
          <Piece piece={piece} />
        </div>
      )}
      {isLegalMove && !piece && <div className="legal-move-dot" />}
      {isLegalMove && piece && <div className="capture-indicator" />}
    </div>
  );
};

export default Square;
