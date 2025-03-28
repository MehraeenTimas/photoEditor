'use client';
import React from 'react';

const BgColorButton = ({ setBgColor }) => {
  const handleChangeColor = () => {
    const color = prompt('Enter color (e.g., #ff0000):', '#ffffff');
    if (color) setBgColor(color);
  };

  return (
    <button onClick={handleChangeColor} className="p-2 bg-yellow-500 text-white rounded">
      Change Background
    </button>
  );
};

export default BgColorButton;



