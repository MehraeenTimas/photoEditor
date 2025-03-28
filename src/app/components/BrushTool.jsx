'use client';
import React, { useState } from 'react';

const BrushTool = ({ brushMode, setBrushMode, setBrushColor }) => {
  const [color, setColor] = useState('#000000'); // Default black

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm">Brush Tool</span>
      <button
        onClick={() => setBrushMode(!brushMode)}
        className={`p-2 ${brushMode ? 'bg-red-500' : 'bg-gray-500'} text-white rounded`}
      >
        {brushMode ? 'Exit Brush Mode' : 'Enter Brush Mode'}
      </button>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          setBrushColor(e.target.value);
        }}
        className="w-full h-10 cursor-pointer"
      />
    </div>
  );
};

export default BrushTool;