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
    <div className="flex flex-col gap-2">
      <label className="text-sm">Brush Size: {size}px</label>
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