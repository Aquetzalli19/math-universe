import React, { useState, useEffect, useMemo } from 'react';
import { IonButton, IonInput, InputChangeEventDetail } from '@ionic/react'; // Importa componentes de Ionic
import useGameLogic from './usePlayer'; // Importa el hook useGameLogic
import ExerciseCard from '../exercises/ExerciseCard';

const Game: React.FC = () => {
  const [numPlayers, setNumPlayers] = useState<number>(0);
  const [playersInitialized, setPlayersInitialized] = useState<boolean>(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [correctCounts, setCorrectCounts] = useState<number[]>([]);

  useEffect(() => {
    // Actualizar correctCounts cuando cambia numPlayers
    setCorrectCounts(Array.from({ length: numPlayers }, () => 0));
  }, [numPlayers]);

  const generatePlayersData = (numPlayers: number) => {
    const playersData = [];
    for (let i = 0; i < numPlayers; i++) {
      playersData.push({
        name: `Jugador ${i + 1}`,
      });
    }
    return playersData;
  };

  const playersData = generatePlayersData(numPlayers);
  const { currentPlayerIndex, nextPlayer } = useGameLogic(playersData);

  const handleNumPlayersChange = (e: CustomEvent<InputChangeEventDetail>) => {
    const value = e.detail.value;
    if (value) {
      setNumPlayers(parseInt(value, 10));
    }
  };
  

  const handleInitializePlayersClick = () => {
    setPlayersInitialized(true);
  };

  const handleNextPlayerClick = () => {
    nextPlayer();
    setActivePlayerIndex((activePlayerIndex + 1) % numPlayers);
  };

  const handleExerciseCorrect = (playerIndex: number) => {
    setCorrectCounts(prevCounts => {
      const updatedCounts = [...prevCounts];
      updatedCounts[playerIndex]++;
      alert(`El Jugador ${playerIndex + 1} ha contestado correctamente ${updatedCounts[playerIndex]} ejercicios.`);
      if (updatedCounts[playerIndex] === 5) {
        alert(`¡El Jugador ${playerIndex + 1} ha completado todos los ejercicios correctamente!`);
        window.location.reload();
      }
      return updatedCounts;
    });
  };

  const exerciseCards = useMemo(() => {
    if (!playersInitialized) return [];
    return Array.from({ length: numPlayers }, (_, index) => (
      <ExerciseCard
        key={`ExerciseCard_${index}`}
        onExerciseCorrect={() => handleExerciseCorrect(index)}
        handleNextPlayerClick={handleNextPlayerClick}
        disabled={activePlayerIndex !== index}
        activePlayerIndex={activePlayerIndex}
      />
    ));
  }, [playersInitialized, numPlayers, activePlayerIndex]);

  return (
    <div>
      <label htmlFor="numPlayers">Número de jugadores:</label>
      <IonInput type="number" id="numPlayers" value={numPlayers.toString()} onIonChange={handleNumPlayersChange} disabled={playersInitialized} />
      <IonButton onClick={handleInitializePlayersClick} disabled={playersInitialized}>Inicializar Jugadores</IonButton>
      <div style={{ marginBottom: '2rem' }}>
        {exerciseCards.map((exerciseCard, index) => (
          <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '10px', width: '110rem', height: '72rem' }}>
            <h3 style={{ color: activePlayerIndex === index ? 'blue' : 'black' }}>Jugador {index + 1}</h3>
            {exerciseCard}
            <IonButton onClick={handleNextPlayerClick} disabled={activePlayerIndex !== index}>Siguiente jugador</IonButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
