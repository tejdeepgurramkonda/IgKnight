package com.example.IgKnight.chess.dto;

public class CreateGameRequest {
    private Integer timeControl; // in seconds, null for unlimited
    private Integer timeIncrement; // in seconds
    private Boolean isRated;

    public CreateGameRequest() {}

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
}
