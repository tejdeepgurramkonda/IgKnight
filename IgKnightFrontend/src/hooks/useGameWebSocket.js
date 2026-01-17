import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8081/ws/chess';

export const useGameWebSocket = (gameId, onGameUpdate, onMoveReceived, onGameEnd, onChatReceived) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const gameUpdateRef = useRef(onGameUpdate);
  const moveReceivedRef = useRef(onMoveReceived);
  const gameEndRef = useRef(onGameEnd);
  const chatReceivedRef = useRef(onChatReceived);

  useEffect(() => { gameUpdateRef.current = onGameUpdate; }, [onGameUpdate]);
  useEffect(() => { moveReceivedRef.current = onMoveReceived; }, [onMoveReceived]);
  useEffect(() => { gameEndRef.current = onGameEnd; }, [onGameEnd]);
  useEffect(() => { chatReceivedRef.current = onChatReceived; }, [onChatReceived]);

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

      client.subscribe(`/topic/game/${gameId}`, (message) => {
        const gameData = JSON.parse(message.body);
        gameUpdateRef.current?.(gameData);
      });

      client.subscribe(`/topic/game/${gameId}/move`, (message) => {
        const moveData = JSON.parse(message.body);
        moveReceivedRef.current?.(moveData);
      });

      client.subscribe(`/topic/game/${gameId}/end`, (message) => {
        const endData = JSON.parse(message.body);
        gameEndRef.current?.(endData);
      });

      client.subscribe(`/topic/game/${gameId}/start`, (message) => {
        const startData = JSON.parse(message.body);
        gameUpdateRef.current?.(startData);
      });

      client.subscribe(`/topic/game/${gameId}/chat`, (message) => {
        const chatData = JSON.parse(message.body);
        chatReceivedRef.current?.(chatData);
      });

      client.subscribe(`/topic/game/${gameId}/player-joined`, (message) => {
        const playerData = JSON.parse(message.body);
        gameUpdateRef.current?.(playerData);
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
  }, [gameId]);

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

  const sendChat = useCallback((text) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: `/app/game/${gameId}/chat`,
        body: JSON.stringify({ message: text }),
      });
    }
  }, [gameId, connected]);

  return {
    connected,
    error,
    sendMove,
    resignGame,
    sendChat,
  };
};

export default useGameWebSocket;
