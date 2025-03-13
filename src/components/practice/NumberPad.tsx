
import React from 'react';
import { Delete } from 'lucide-react';

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
      <button
        className="number-pad-button h-16"
        onClick={() => onNumberClick(0)}
      >
        0
      </button>
      <button
        className="number-pad-button h-16 col-span-2 bg-muted/50"
        onClick={onDeleteClick}
      >
        <Delete size={20} className="mr-2" /> Delete
      </button>
    </div>
  );
};

export default NumberPad;
