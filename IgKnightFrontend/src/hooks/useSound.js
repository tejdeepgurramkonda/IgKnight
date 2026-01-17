import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for playing chess game sounds
 * Uses Web Audio API to generate sounds programmatically
 */
const useSound = () => {
  const audioContextRef = useRef(null);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('soundMuted');
    return saved ? JSON.parse(saved) : false;
  });

  const ensureContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  useEffect(() => {
    ensureContext();
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [ensureContext]);

  useEffect(() => {
    localStorage.setItem('soundMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.3) => {
    if (isMuted) return;

    const ctx = ensureContext();
    if (!ctx || ctx.state === 'closed') return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [isMuted]);

  const playChord = useCallback((frequencies, duration, volume = 0.2) => {
    frequencies.forEach(freq => playTone(freq, duration, 'sine', volume));
  }, [playTone]);

  // Move sound - simple click
  const playMove = useCallback(() => {
    playTone(440, 0.1, 'sine', 0.3);
  }, [playTone]);

  // Capture sound - lower pitch with quick decay
  const playCapture = useCallback(() => {
    if (isMuted) return;

    const ctx = ensureContext();
    if (!ctx || ctx.state === 'closed') return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 220;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [isMuted]);

  // Check sound - ascending tones
  const playCheck = useCallback(() => {
    playTone(523, 0.08, 'sine', 0.35); // C5
    setTimeout(() => playTone(659, 0.12, 'sine', 0.35), 80); // E5
  }, [playTone]);

  // Checkmate sound - triumphant chord progression
  const playCheckmate = useCallback(() => {
    playChord([262, 330, 392], 0.3, 0.3); // C major chord
    setTimeout(() => playChord([294, 370, 440], 0.4, 0.3), 300); // D major chord
    setTimeout(() => playChord([262, 330, 392, 523], 0.6, 0.35), 700); // C major chord with octave
  }, [playChord]);

  // Game start sound - pleasant ascending tones
  const playGameStart = useCallback(() => {
    playTone(392, 0.1, 'sine', 0.25); // G4
    setTimeout(() => playTone(494, 0.1, 'sine', 0.25), 100); // B4
    setTimeout(() => playTone(587, 0.15, 'sine', 0.3), 200); // D5
  }, [playTone]);

  // Game end sound - descending tones
  const playGameEnd = useCallback(() => {
    playTone(587, 0.15, 'sine', 0.3); // D5
    setTimeout(() => playTone(494, 0.15, 'sine', 0.3), 150); // B4
    setTimeout(() => playTone(392, 0.2, 'sine', 0.3), 300); // G4
  }, [playTone]);

  // Castling sound - double tone
  const playCastle = useCallback(() => {
    playTone(440, 0.08, 'sine', 0.3);
    setTimeout(() => playTone(554, 0.08, 'sine', 0.3), 60);
  }, [playTone]);

  // Promotion sound - ascending arpeggio
  const playPromotion = useCallback(() => {
    playTone(523, 0.08, 'sine', 0.3); // C5
    setTimeout(() => playTone(659, 0.08, 'sine', 0.3), 70); // E5
    setTimeout(() => playTone(784, 0.08, 'sine', 0.3), 140); // G5
    setTimeout(() => playTone(1047, 0.15, 'sine', 0.35), 210); // C6
  }, [playTone]);

  // Error/illegal move sound
  const playError = useCallback(() => {
    playTone(200, 0.2, 'sawtooth', 0.2);
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    playMove,
    playCapture,
    playCheck,
    playCheckmate,
    playGameStart,
    playGameEnd,
    playCastle,
    playPromotion,
    playError,
    isMuted,
    toggleMute
  };
};

export default useSound;
