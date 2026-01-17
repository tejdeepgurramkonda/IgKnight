package com.example.IgKnight.chess.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GameResponse {
    private Long id;
    private PlayerInfo whitePlayer;
    private PlayerInfo blackPlayer;
    private String fenPosition;
    private String currentTurn;
    private String status;
    private Long winnerId;
    private Integer whiteTimeRemaining;
    private Integer blackTimeRemaining;
    private Integer timeControl;
    private Integer timeIncrement;
    private Boolean isRated;
    private Boolean isCheck;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime endedAt;
    private List<MoveInfo> moves;

    public static class PlayerInfo {
        private Long id;
        private String username;

        public PlayerInfo(Long id, String username) {
            this.id = id;
            this.username = username;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }

    public static class MoveInfo {
        private Integer moveNumber;
        private String from;
        private String to;
        private String piece;
        private String san;
        private String resultingFen;
        private Boolean isCapture;
        private Boolean isCheck;
        private Boolean isCheckmate;

        public MoveInfo() {}

        public Integer getMoveNumber() {
            return moveNumber;
        }

        public void setMoveNumber(Integer moveNumber) {
            this.moveNumber = moveNumber;
        }

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public String getPiece() {
            return piece;
        }

        public void setPiece(String piece) {
            this.piece = piece;
        }

        public String getSan() {
            return san;
        }

        public void setSan(String san) {
            this.san = san;
        }

        public String getResultingFen() {
            return resultingFen;
        }

        public void setResultingFen(String resultingFen) {
            this.resultingFen = resultingFen;
        }

        public Boolean getIsCapture() {
            return isCapture;
        }

        public void setIsCapture(Boolean isCapture) {
            this.isCapture = isCapture;
        }

        public Boolean getIsCheck() {
            return isCheck;
        }

        public void setIsCheck(Boolean isCheck) {
            this.isCheck = isCheck;
        }

        public Boolean getIsCheckmate() {
            return isCheckmate;
        }

        public void setIsCheckmate(Boolean isCheckmate) {
            this.isCheckmate = isCheckmate;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlayerInfo getWhitePlayer() {
        return whitePlayer;
    }

    public void setWhitePlayer(PlayerInfo whitePlayer) {
        this.whitePlayer = whitePlayer;
    }

    public PlayerInfo getBlackPlayer() {
        return blackPlayer;
    }

    public void setBlackPlayer(PlayerInfo blackPlayer) {
        this.blackPlayer = blackPlayer;
    }

    public String getFenPosition() {
        return fenPosition;
    }

    public void setFenPosition(String fenPosition) {
        this.fenPosition = fenPosition;
    }

    public String getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(String currentTurn) {
        this.currentTurn = currentTurn;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(Long winnerId) {
        this.winnerId = winnerId;
    }

    public Integer getWhiteTimeRemaining() {
        return whiteTimeRemaining;
    }

    public void setWhiteTimeRemaining(Integer whiteTimeRemaining) {
        this.whiteTimeRemaining = whiteTimeRemaining;
    }

    public Integer getBlackTimeRemaining() {
        return blackTimeRemaining;
    }

    public void setBlackTimeRemaining(Integer blackTimeRemaining) {
        this.blackTimeRemaining = blackTimeRemaining;
    }

    public Integer getTimeControl() {
        return timeControl;
    }

    public void setTimeControl(Integer timeControl) {
        this.timeControl = timeControl;
    }

    public Integer getTimeIncrement() {
        return timeIncrement;
    }

    public void setTimeIncrement(Integer timeIncrement) {
        this.timeIncrement = timeIncrement;
    }

    public Boolean getIsRated() {
        return isRated;
    }

    public void setIsRated(Boolean isRated) {
        this.isRated = isRated;
    }

    public Boolean getIsCheck() {
        return isCheck;
    }

    public void setIsCheck(Boolean isCheck) {
        this.isCheck = isCheck;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
    }

    public List<MoveInfo> getMoves() {
        return moves;
    }

    public void setMoves(List<MoveInfo> moves) {
        this.moves = moves;
    }
}
