package com.example.IgKnight.chess.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class MakeMoveRequest {
    @NotBlank(message = "From square is required")
    @Pattern(regexp = "[a-h][1-8]", message = "Invalid from square format")
    private String from;

    @NotBlank(message = "To square is required")
    @Pattern(regexp = "[a-h][1-8]", message = "Invalid to square format")
    private String to;

    @Pattern(regexp = "[QRBN]?", message = "Invalid promotion piece")
    private String promotion; // Q, R, B, N

    public MakeMoveRequest() {}

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

    public String getPromotion() {
        return promotion;
    }

    public void setPromotion(String promotion) {
        this.promotion = promotion;
    }
}
