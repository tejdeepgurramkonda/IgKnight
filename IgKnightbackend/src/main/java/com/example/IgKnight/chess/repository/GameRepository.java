package com.example.IgKnight.chess.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.IgKnight.chess.engine.GameStatus;
import com.example.IgKnight.chess.entity.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {

    @Query("SELECT g FROM Game g WHERE g.status = :status")
    List<Game> findByStatus(@Param("status") GameStatus status);

    @Query("SELECT g FROM Game g WHERE (g.whitePlayer.id = :userId OR g.blackPlayer.id = :userId) " +
           "AND g.status IN (:statuses) ORDER BY g.updatedAt DESC")
    List<Game> findActiveGamesByUserId(@Param("userId") Long userId, @Param("statuses") List<GameStatus> statuses);

    @Query("SELECT g FROM Game g WHERE (g.whitePlayer.id = :userId OR g.blackPlayer.id = :userId) " +
           "ORDER BY g.createdAt DESC")
    List<Game> findAllGamesByUserId(@Param("userId") Long userId);

    @Query("SELECT g FROM Game g WHERE g.status = :status AND " +
           "(g.whitePlayer.id = :userId OR g.blackPlayer.id = :userId)")
    List<Game> findGamesByUserIdAndStatus(@Param("userId") Long userId, @Param("status") GameStatus status);

    @Query("SELECT g FROM Game g WHERE g.status = :status AND g.whitePlayer.id != :userId " +
           "ORDER BY g.createdAt ASC")
    Optional<Game> findFirstWaitingGameNotByUser(@Param("status") GameStatus status, @Param("userId") Long userId);

    @Query("SELECT g FROM Game g WHERE g.status = :status AND g.whitePlayer.id != :userId " +
           "AND g.timeControl = :timeControl AND g.timeIncrement = :timeIncrement " +
           "ORDER BY g.createdAt ASC")
    Optional<Game> findFirstWaitingGameByTimeControl(
        @Param("status") GameStatus status, 
        @Param("userId") Long userId,
        @Param("timeControl") Integer timeControl,
        @Param("timeIncrement") Integer timeIncrement
    );

    @Query("SELECT g FROM Game g WHERE g.status = :status AND g.whitePlayer.id != :userId " +
           "AND g.timeControl IS NULL " +
           "ORDER BY g.createdAt ASC")
    Optional<Game> findFirstWaitingGameWithoutTimeControl(@Param("status") GameStatus status, @Param("userId") Long userId);

    @Query("SELECT g FROM Game g WHERE g.status = 'WAITING' AND g.blackPlayer IS NULL " +
           "AND g.whitePlayer.id != :userId ORDER BY g.createdAt ASC")
    Optional<Game> findAvailableGameForJoin(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM Game g WHERE g.whitePlayer.id = :userId OR g.blackPlayer.id = :userId")
    Long countGamesByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(g) FROM Game g WHERE g.status IN (:statuses)")
    Long countByStatusIn(@Param("statuses") List<GameStatus> statuses);
}
