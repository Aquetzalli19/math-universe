import { useState } from 'react';

interface Player {
  name: string;
}

interface UseGameLogic {
  currentPlayerIndex: number;
  nextPlayer: () => void;
}

const useGameLogic = (playersData: Player[]): UseGameLogic => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const nextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playersData.length);
  };

  return {
    currentPlayerIndex,
    nextPlayer
  };
};

export default useGameLogic;
