'use client';
import React, { useState } from 'react';

const BrushSizePicker = ({ setBrushSize }) => {
  const [size, setSize] = useState(5);

  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    setBrushSize(newSize);
  };

  return (
    <div  className="flex flex-row items-center gap-2 p-2 bg-gray-500 rounded">
      <label className=""> {size}px</label>
      <input
        type="range"
        min="1"
        max="50"
        value={size}
        onChange={handleSizeChange}
        className="w-full"
      />
    </div>
  );
};

export default BrushSizePicker;