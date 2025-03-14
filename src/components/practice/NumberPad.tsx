
import React from 'react';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onDeleteClick: () => void;
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onDeleteClick }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          className="number-pad-button h-16"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
      <div className="col-span-3 flex justify-center">
        <button
          className="number-pad-button h-16 w-full max-w-32"
          onClick={() => onNumberClick(0)}
        >
          0
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
