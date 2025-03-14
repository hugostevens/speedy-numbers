
import React from 'react';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onDeleteClick: () => void;
}

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onDeleteClick }) => {
  // Colors for the number buttons
  const getButtonColor = (num: number) => {
    const colors = [
      'bg-blue-100 hover:bg-blue-200 text-blue-700',
      'bg-purple-100 hover:bg-purple-200 text-purple-700',
      'bg-green-100 hover:bg-green-200 text-green-700',
      'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
      'bg-pink-100 hover:bg-pink-200 text-pink-700',
      'bg-indigo-100 hover:bg-indigo-200 text-indigo-700',
      'bg-red-100 hover:bg-red-200 text-red-700',
      'bg-orange-100 hover:bg-orange-200 text-orange-700',
      'bg-teal-100 hover:bg-teal-200 text-teal-700',
      'bg-cyan-100 hover:bg-cyan-200 text-cyan-700',
    ];
    return colors[num % colors.length];
  };

  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          className={`number-pad-button h-16 text-2xl font-bold rounded-xl shadow-md transform transition-all duration-150 active:scale-95 ${getButtonColor(num)}`}
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
      <div className="col-span-3 flex justify-between">
        <button
          className="number-pad-button h-16 w-full mr-3 text-2xl font-bold rounded-xl shadow-md transform transition-all duration-150 active:scale-95 bg-red-100 hover:bg-red-200 text-red-700"
          onClick={onDeleteClick}
        >
          ⌫
        </button>
        <button
          className="number-pad-button h-16 w-full text-2xl font-bold rounded-xl shadow-md transform transition-all duration-150 active:scale-95 bg-primary/20 hover:bg-primary/30 text-primary"
          onClick={() => onNumberClick(0)}
        >
          0
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
