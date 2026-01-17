package com.example.IgKnight.chess.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.IgKnight.chess.dto.CreateGameRequest;
import com.example.IgKnight.chess.dto.GameResponse;
import com.example.IgKnight.chess.dto.LegalMovesResponse;
import com.example.IgKnight.chess.dto.MakeMoveRequest;
import com.example.IgKnight.chess.service.GameService;
import com.example.IgKnight.security.JwtUtil;
import com.example.IgKnight.security.UserPrincipal;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/chess")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GameController {

    private final GameService gameService;
    private final JwtUtil jwtUtil;

    public GameController(GameService gameService, JwtUtil jwtUtil) {
        this.gameService = gameService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/games")
    public ResponseEntity<GameResponse> createGame(
            @RequestBody CreateGameRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        GameResponse game = gameService.createGame(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(game);
    }

    @PostMapping("/games/{gameId}/join")
    public ResponseEntity<GameResponse> joinGame(
            @PathVariable Long gameId,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        GameResponse game = gameService.joinGame(gameId, userId);
        return ResponseEntity.ok(game);
    }

    @GetMapping("/games/{gameId}")
    public ResponseEntity<GameResponse> getGame(@PathVariable Long gameId) {
        GameResponse game = gameService.getGame(gameId);
        return ResponseEntity.ok(game);
    }

    @GetMapping("/games")
    public ResponseEntity<List<GameResponse>> getUserGames(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<GameResponse> games = gameService.getUserGames(userId);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/games/active")
    public ResponseEntity<List<GameResponse>> getActiveGames(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        List<GameResponse> games = gameService.getActiveGames(userId);
        return ResponseEntity.ok(games);
    }

    @PostMapping("/games/{gameId}/moves")
    public ResponseEntity<GameResponse> makeMove(
            @PathVariable Long gameId,
            @Valid @RequestBody MakeMoveRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        GameResponse game = gameService.makeMove(gameId, userId, request);
        return ResponseEntity.ok(game);
    }

    @GetMapping("/games/{gameId}/legal-moves/{square}")
    public ResponseEntity<LegalMovesResponse> getLegalMoves(
            @PathVariable Long gameId,
            @PathVariable String square) {
        LegalMovesResponse legalMoves = gameService.getLegalMoves(gameId, square);
        return ResponseEntity.ok(legalMoves);
    }

    @PostMapping("/games/{gameId}/resign")
    public ResponseEntity<GameResponse> resignGame(
            @PathVariable Long gameId,
            Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        GameResponse game = gameService.resignGame(gameId, userId);
        return ResponseEntity.ok(game);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) authentication.getPrincipal()).getUserId();
        }
        throw new RuntimeException("User not authenticated");
    }
}
