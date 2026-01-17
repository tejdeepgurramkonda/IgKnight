import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8081/ws/chess';

export const useGameWebSocket = (gameId, onGameUpdate, onMoveReceived, onGameEnd) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gameId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log('[WebSocket]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket connected for game:', gameId);
      setConnected(true);
      setError(null);

      // Subscribe to game updates
      client.subscribe(`/topic/game/${gameId}`, (message) => {
        const gameData = JSON.parse(message.body);
        onGameUpdate?.(gameData);
      });

      // Subscribe to move notifications
      client.subscribe(`/topic/game/${gameId}/move`, (message) => {
        const moveData = JSON.parse(message.body);
        onMoveReceived?.(moveData);
      });

      // Subscribe to game end notifications
      client.subscribe(`/topic/game/${gameId}/end`, (message) => {
        const endData = JSON.parse(message.body);
        onGameEnd?.(endData);
      });

      // Subscribe to game start notifications
      client.subscribe(`/topic/game/${gameId}/start`, (message) => {
        const startData = JSON.parse(message.body);
        onGameUpdate?.(startData);
      });

      // Subscribe to player joined notifications
      client.subscribe(`/topic/game/${gameId}/player-joined`, (message) => {
        const playerData = JSON.parse(message.body);
        onGameUpdate?.(playerData);
      });
    };

    client.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
      setError(frame.headers['message']);
      setConnected(false);
    };

    client.onWebSocketClose = () => {
      console.log('WebSocket closed');
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [gameId, onGameUpdate, onMoveReceived, onGameEnd]);

  const sendMove = useCallback((from, to, promotion = null) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: `/app/game/${gameId}/move`,
        body: JSON.stringify({ from, to, promotion }),
      });
    }
  }, [gameId, connected]);

  const resignGame = useCallback(() => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: `/app/game/${gameId}/resign`,
        body: JSON.stringify({}),
      });
    }
  }, [gameId, connected]);

  return {
    connected,
    error,
    sendMove,
    resignGame,
  };
};

export default useGameWebSocket;
