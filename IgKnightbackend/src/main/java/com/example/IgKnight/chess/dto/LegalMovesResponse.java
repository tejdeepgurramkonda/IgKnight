package com.example.IgKnight.chess.dto;

import java.util.List;

public class LegalMovesResponse {
    private String from;
    private List<String> legalMoves;

    public LegalMovesResponse(String from, List<String> legalMoves) {
        this.from = from;
        this.legalMoves = legalMoves;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<String> getLegalMoves() {
        return legalMoves;
    }

    public void setLegalMoves(List<String> legalMoves) {
        this.legalMoves = legalMoves;
    }
}
