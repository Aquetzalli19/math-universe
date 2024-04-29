import React, { useEffect, useState } from 'react';
import { IonButton, IonInput } from '@ionic/react';
import adds from "./operations/Adds";
import subtractions from "./operations/Substractions";
import multiplications from "./operations/Multiplications";
import divisions from "./operations/Division";
import DiceRoller from '../pages/Dice/Dice';
import { InputChangeEventDetail } from '@ionic/core';

interface Exercise {
    question: string;
    answer: number;
}

interface PlayerExercises {
    adds: Exercise[];
    subtractions: Exercise[];
    multiplications: Exercise[];
    divisions: Exercise[];
}

interface ExerciseCardProps {
    onExerciseCorrect: () => void;
    handleNextPlayerClick: () => void;
    disabled: boolean;
    activePlayerIndex: number;
}

interface DiceRoller {
    onDiceRoll: (number: number) => void;
    activePlayerIndex: number;
    disabled: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ onExerciseCorrect, disabled }) => {
    const [movements, setMovements] = useState<number>(0);
    const [buttonStates, setButtonStates] = useState<boolean[]>(Array(48).fill(true));
    const [diceNumber, setDiceNumber] = useState<number | null>(null);

    const handleDiceRoll = (number: number) => {
        setDiceNumber(number);
        setMovements(number);
    };

    const selectRandomExercises = (exercises: Exercise[], count: number) => {
        const shuffledExercises = exercises.sort(() => Math.random() - 0.5);
        return shuffledExercises.slice(0, count);
    };

    const handleMovementsChange = (event: CustomEvent<InputChangeEventDetail>) => {
        const value = event.detail.value;
        if (typeof value === 'string') {
            setMovements(parseInt(value, 10));
        }
    };
    


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>, exercise: Exercise, exerciseIndex: number) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const userAnswer = form.elements.namedItem('answer') as HTMLInputElement;
        if (userAnswer && userAnswer.value.trim() === exercise.answer.toString()) {
            console.log("¡Respuesta Correcta!");
            onExerciseCorrect();
            setButtonStates(prevStates => {
                const updatedStates = [...prevStates];
                updatedStates[exerciseIndex] = false;
                return updatedStates;
            });
        } else {
            console.log("Respuesta Incorrecta");
        }
    };


    const renderExercises = (exercises: Exercise[]) => {
        const shuffledIndexes = [...Array(exercises.length).keys()].sort(() => Math.random() - 0.5);
        const enabledIndexes = shuffledIndexes.slice(0, movements);

        return exercises.map((exercise, index) => {
            const isEnabled = enabledIndexes.includes(index);

            return (
                <div key={index}>
                    <p style={{ marginRight: '3rem' }}>{`${exercise.question}`}</p>
                    <form onSubmit={(event) => handleSubmit(event, exercise, index)}>
                        <IonInput type="text" name="answer" disabled={!isEnabled || disabled} />
                        <IonButton type="submit" disabled={!isEnabled || disabled || !buttonStates[index]}>
                            Enviar
                        </IonButton>
                    </form>
                </div>
            );
        });
    };

    const renderPlayerCard = (playerExercises: PlayerExercises, playerName: string) => {
        return (
            <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px', marginBottom: '10rem', width: '100rem' }}>
                <h3>{playerName}</h3>
                <IonInput
                    type="number"
                    value={movements.toString()}
                    onIonChange={(e: CustomEvent<InputChangeEventDetail>) => handleMovementsChange(e)}
                    disabled={disabled}
                />
    
                <DiceRoller onDiceRoll={handleDiceRoll}  disabled={disabled} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <h4>Sumas</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {renderExercises(selectRandomExercises(playerExercises.adds, 8))}
                        </div>
                    </div>
                    <div>
                        <h4>Restas</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {renderExercises(selectRandomExercises(playerExercises.subtractions, 8))}
                        </div>
                    </div>
                    <div>
                        <h4>Multiplicaciones</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {renderExercises(selectRandomExercises(playerExercises.multiplications, 8))}
                        </div>
                    </div>
                    <div>
                        <h4>Divisiones</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {renderExercises(selectRandomExercises(playerExercises.divisions, 8))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    const playerExercises: PlayerExercises = {
        adds,
        subtractions,
        multiplications,
        divisions
    };
    
    return (
        <div>
            {renderPlayerCard(playerExercises, "Math Universe")}
        </div>
    );
}

export default ExerciseCard; 