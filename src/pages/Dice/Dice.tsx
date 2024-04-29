import React, { useState } from 'react';
import { IonButton } from '@ionic/react';

interface DiceRollerProps {
  onDiceRoll: (number: number) => void;
  disabled: boolean;
}

const RandomNumber: React.FC<{ onNumberChange: (number: number) => void }> = ({ onNumberChange }) => {
  const randomNumber = Math.ceil(Math.random() * 6);

  // Llama a la función de devolución de llamada con el número aleatorio generado
  onNumberChange(randomNumber);

  // Devolvemos null porque no necesitamos renderizar nada aquí
  return null;
};

const DiceRoller: React.FC<DiceRollerProps> = ({ onDiceRoll, disabled }) => {
  const [dice, setDice] = useState<number | null>(null);

  return (
    <div className="container">
      {/* Renderizamos el componente RandomNumber y le pasamos la función onNumberChange */}
      <RandomNumber
        onNumberChange={(number) => {
          setDice(number);
          // Llamamos a la función de devolución de llamada cuando se actualiza el número
          onDiceRoll(number);
        }}
      />
      {/* Renderizamos el botón para lanzar el dado */}
      <IonButton
        onClick={() => {
          setDice(null); // Reiniciamos el número aleatorio cuando se presiona el botón
        }}
        disabled={disabled} // Deshabilita el botón cuando disabled es true
      >
        Tirar el Dado
      </IonButton>
    </div>
  );
};

export default DiceRoller;
