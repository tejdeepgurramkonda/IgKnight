import React, { createContext, useContext } from 'react';
import useSound from '../hooks/useSound';

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
  const sound = useSound();

  return (
    <SoundContext.Provider value={sound}>
      {children}
    </SoundContext.Provider>
  );
};

export const useGameSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useGameSound must be used within SoundProvider');
  }
  return context;
};
