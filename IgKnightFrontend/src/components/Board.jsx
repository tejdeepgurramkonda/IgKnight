import React, { useState, useEffect, useCallback } from 'react';
import Square from './Square';
import { parseFEN, algebraicToIndices, indicesToAlgebraic } from '../utils/chessUtils';
import './Board.css';

const Board = ({ 
  fen, 
  playerColor = 'WHITE',
  onMove, 
  legalMoves = [],
  lastMove = null,
  isCheck = false,
  checkKingSquare = null,
  disabled = false,
  gameId,
  onGetLegalMoves
}) => {
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMovesForSelected, setLegalMovesForSelected] = useState([]);

  useEffect(() => {
    if (fen) {
      const parsedBoard = parseFEN(fen);
      setBoard(parsedBoard);
    }
  }, [fen]);

  const isPlayerPiece = useCallback((piece) => {
    if (!piece) return false;
    return piece.startsWith(playerColor);
  }, [playerColor]);

  const fetchLegalMoves = useCallback(async (square) => {
    if (onGetLegalMoves && gameId) {
      try {
        const moves = await onGetLegalMoves(gameId, square);
        setLegalMovesForSelected(moves.legalMoves || []);
      } catch (err) {
        console.error('Failed to fetch legal moves:', err);
        setLegalMovesForSelected([]);
      }
    }
  }, [onGetLegalMoves, gameId]);

  const handleSquareClick = useCallback(async (rank, file) => {
    if (disabled) return;

    const square = indicesToAlgebraic(rank, file);
    const piece = board[rank]?.[file];

    // If a square is already selected
    if (selectedSquare) {
      const isLegalMove = legalMovesForSelected.includes(square);
      
      if (isLegalMove) {
        // Make the move
        const promotion = shouldPromote(selectedSquare, square, board) ? 'Q' : null;
        await onMove(selectedSquare, square, promotion);
        setSelectedSquare(null);
        setLegalMovesForSelected([]);
      } else if (piece && isPlayerPiece(piece)) {
        // Select a different piece of the player's color
        setSelectedSquare(square);
        await fetchLegalMoves(square);
      } else {
        // Deselect
        setSelectedSquare(null);
        setLegalMovesForSelected([]);
      }
    } else if (piece && isPlayerPiece(piece)) {
      // Select a piece of the player's color
      setSelectedSquare(square);
      await fetchLegalMoves(square);
    }
  }, [board, selectedSquare, legalMovesForSelected, onMove, disabled, isPlayerPiece, fetchLegalMoves]);

  const handleDragStart = useCallback((e, rank, file) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    const piece = board[rank]?.[file];
    if (!piece || !isPlayerPiece(piece)) {
      e.preventDefault();
      return;
    }
    const square = indicesToAlgebraic(rank, file);
    setSelectedSquare(square);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', square);
    // Fetch legal moves for dragging
    fetchLegalMoves(square);
  }, [disabled, board, isPlayerPiece, fetchLegalMoves]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(async (e, rank, file) => {
    e.preventDefault();
    if (disabled) return;

    const fromSquare = e.dataTransfer.getData('text/plain');
    const toSquare = indicesToAlgebraic(rank, file);

    if (fromSquare !== toSquare) {
      const promotion = shouldPromote(fromSquare, toSquare, board) ? 'Q' : null;
      await onMove(fromSquare, toSquare, promotion);
    }

    setSelectedSquare(null);
    setLegalMovesForSelected([]);
  }, [board, onMove, disabled]);

  const shouldPromote = (from, to, board) => {
    const fromIndices = algebraicToIndices(from);
    const toIndices = algebraicToIndices(to);
    const piece = board[fromIndices.rank]?.[fromIndices.file];
    
    if (!piece) return false;
    
    const isPawn = piece.includes('PAWN');
    const isLastRank = toIndices.rank === 0 || toIndices.rank === 7;
    
    return isPawn && isLastRank;
  };

  const isSquareLight = (rank, file) => (rank + file) % 2 !== 0;

  const isLastMoveSquare = (rank, file) => {
    if (!lastMove) return false;
    const square = indicesToAlgebraic(rank, file);
    return lastMove.from === square || lastMove.to === square;
  };

  const isCheckSquare = (rank, file) => {
    if (!isCheck || !checkKingSquare) return false;
    const square = indicesToAlgebraic(rank, file);
    return square === checkKingSquare;
  };

  const renderBoard = () => {
    const squares = [];
    const displayBoard = playerColor === 'BLACK' ? [...board].reverse() : board;
    
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const actualRank = playerColor === 'BLACK' ? 7 - rank : rank;
        const actualFile = playerColor === 'BLACK' ? 7 - file : file;
        const square = indicesToAlgebraic(actualRank, actualFile);
        const piece = board[actualRank]?.[actualFile];
        
        squares.push(
          <Square
            key={square}
            rank={actualRank}
            file={actualFile}
            piece={piece}
            isLight={isSquareLight(actualRank, actualFile)}
            isSelected={selectedSquare === square}
            isLegalMove={legalMovesForSelected.includes(square)}
            isLastMove={isLastMoveSquare(actualRank, actualFile)}
            isCheck={isCheckSquare(actualRank, actualFile)}
            onClick={() => handleSquareClick(actualRank, actualFile)}
            onDragStart={(e) => handleDragStart(e, actualRank, actualFile)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, actualRank, actualFile)}
          />
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="chess-board-container" role="region" aria-label="Chess board">
      <div className="chess-board-wrapper">
        <div className="chess-board" role="grid" aria-label="Chess game board">
          {renderBoard()}
        </div>
        {/* File coordinates (a-h) */}
        <div className="board-coordinates-files" role="list" aria-label="File coordinates">
          {(playerColor === 'WHITE' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']).map(file => (
            <div key={file} className="coordinate-label" role="listitem">{file}</div>
          ))}
        </div>
        {/* Rank coordinates (1-8) */}
        <div className="board-coordinates-ranks" role="list" aria-label="Rank coordinates">
          {(playerColor === 'WHITE' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8']).map(rank => (
            <div key={rank} className="coordinate-label">{rank}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
