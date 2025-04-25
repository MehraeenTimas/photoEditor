'use client';
import React, { useState } from 'react';

const BrushColorPicker = ({ setBrushColor }) => {
  const [color, setColor] = useState('#000000');

  return (
    <div className="p-2 mb-2 bg-gray-500 text-white rounded flex flex-row items-center gap-2">
      <label className="">Brush Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          setBrushColor(e.target.value);
        }}
        className="w-24 h-8 cursor-pointer"
      />
    </div>
  );
};

export default BrushColorPicker;