package com.example.IgKnight.chess.websocket;

import java.util.Map;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

import com.example.IgKnight.chess.dto.GameResponse;
import com.example.IgKnight.chess.dto.MakeMoveRequest;
import com.example.IgKnight.chess.service.GameService;
import com.example.IgKnight.security.JwtUtil;
import com.example.IgKnight.security.UserPrincipal;

@Controller
public class GameWebSocketController {

    private final GameService gameService;
    private final GameWebSocketService webSocketService;
    private final JwtUtil jwtUtil;

    public GameWebSocketController(GameService gameService,
                                  GameWebSocketService webSocketService,
                                  JwtUtil jwtUtil) {
        this.gameService = gameService;
        this.webSocketService = webSocketService;
        this.jwtUtil = jwtUtil;
    }

    @MessageMapping("/game/{gameId}/move")
    public void handleMove(@DestinationVariable Long gameId,
                          @Payload MakeMoveRequest moveRequest,
                          SimpMessageHeaderAccessor headerAccessor) {
        try {
            String username = headerAccessor.getUser().getName();
            // Extract userId from JWT in session attributes or user principal
            Long userId = extractUserId(headerAccessor);

            GameResponse game = gameService.makeMove(gameId, userId, moveRequest);
            
            // Broadcast move to all players watching this game
            webSocketService.notifyGameUpdate(gameId, game);
            
            Map<String, Object> moveData = Map.of(
                "from", moveRequest.getFrom(),
                "to", moveRequest.getTo(),
                "promotion", moveRequest.getPromotion() != null ? moveRequest.getPromotion() : "",
                "fen", game.getFenPosition(),
                "status", game.getStatus(),
                "isCheck", game.getIsCheck()
            );
            webSocketService.notifyPlayerMove(gameId, moveData);
            
            // Check if game ended
            if (game.getStatus() != null && !game.getStatus().equals("IN_PROGRESS")) {
                Map<String, Object> endData = Map.of(
                    "status", game.getStatus(),
                    "winnerId", game.getWinnerId() != null ? game.getWinnerId() : ""
                );
                webSocketService.notifyGameEnd(gameId, endData);
            }
        } catch (Exception e) {
            // Handle errors - could send error message back to user
        }
    }

    @MessageMapping("/game/{gameId}/join")
    public void handleJoinGame(@DestinationVariable Long gameId,
                              SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long userId = extractUserId(headerAccessor);
            GameResponse game = gameService.joinGame(gameId, userId);
            
            webSocketService.notifyGameUpdate(gameId, game);
            
            Map<String, Object> playerData = Map.of(
                "gameId", gameId,
                "blackPlayer", game.getBlackPlayer()
            );
            webSocketService.notifyPlayerJoined(gameId, playerData);
            
            Map<String, Object> startData = Map.of(
                "gameId", gameId,
                "status", "IN_PROGRESS"
            );
            webSocketService.notifyGameStart(gameId, startData);
        } catch (Exception e) {
            // Handle errors
        }
    }

    @MessageMapping("/game/{gameId}/resign")
    public void handleResign(@DestinationVariable Long gameId,
                            SimpMessageHeaderAccessor headerAccessor) {
        try {
            Long userId = extractUserId(headerAccessor);
            GameResponse game = gameService.resignGame(gameId, userId);
            
            webSocketService.notifyGameUpdate(gameId, game);
            
            Map<String, Object> endData = Map.of(
                "status", "RESIGNATION",
                "winnerId", game.getWinnerId() != null ? game.getWinnerId() : "",
                "resignedUserId", userId
            );
            webSocketService.notifyGameEnd(gameId, endData);
        } catch (Exception e) {
            // Handle errors
        }
    }

    private Long extractUserId(SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor.getUser() instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) headerAccessor.getUser();
            if (auth.getPrincipal() instanceof UserPrincipal) {
                return ((UserPrincipal) auth.getPrincipal()).getUserId();
            }
        }
        throw new RuntimeException("User not authenticated");
    }
}
