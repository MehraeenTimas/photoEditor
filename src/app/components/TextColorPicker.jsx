'use client';
import React, { useState } from 'react';

const TextColorPicker = ({ setTextColor }) => {
  const [color, setColor] = useState('#000000');

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Text Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          setTextColor(e.target.value);
        }}
        className="w-10 h-10 cursor-pointer"
      />
    </div>
  );
};

export default TextColorPicker;