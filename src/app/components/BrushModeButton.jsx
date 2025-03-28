'use client';
import React from 'react';

const BrushModeButton = ({ brushMode, setBrushMode }) => {
  return (
    <button
      onClick={() => setBrushMode(!brushMode)}
      className={`p-2 ${brushMode ? 'bg-red-500' : 'bg-gray-500'} text-white rounded`}
    >
      {brushMode ? 'Exit Brush Mode' : 'Enter Brush Mode'}
    </button>
  );
};

export default BrushModeButton;