'use client';
import React from 'react';

const BrushColorButton = ({ setBrushColor }) => {
  const handleChangeColor = () => {
    const color = prompt('Enter brush color (e.g., #0000ff):', '#000000');
    if (color) setBrushColor(color);
  };

  return (
    <button onClick={handleChangeColor} className="p-2 bg-purple-500 text-white rounded">
      Change Brush Color
    </button>
  );
};

export default BrushColorButton;