'use client';
import React, { useState } from 'react';

const TextColorPicker = ({ setTextColor }) => {
  const [color, setColor] = useState('#000000');

  return (
    <div className="flex mb-2 flex-row items-center gap-2 p-2 bg-gray-500 rounded">
      <label className="">Text Color:</label>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          setTextColor(e.target.value);
        }}
        className="w-26 h-8 cursor-pointer"
      />
    </div>
  );
};

export default TextColorPicker;