'use client';
import React, { useState } from 'react';

const TextTool = ({ setElements }) => {
  const [textColor, setTextColor] = useState('#000000'); // Default black

  const handleAddText = () => {
    setElements((prev) => [
      ...prev,
      { type: 'text', id: Date.now(), text: 'New Text', x: 50, y: 50, fill: textColor },
    ]);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm">Text Tool</span>
      <button
        onClick={handleAddText}
        className="p-2 bg-green-500 text-white rounded"
      >
        Add Text
      </button>
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
        className="w-full h-10 cursor-pointer"
      />
    </div>
  );
};

export default TextTool;