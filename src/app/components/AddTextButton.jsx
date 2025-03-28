'use client';
import React from 'react';
import { generateUniqueId } from './utils';

const AddTextButton = ({ setElements, textColor, fontFamily, saveHistory }) => {
  const handleAddText = () => {
    setElements((prev) => {
      const newElements = [
        ...prev,
        { type: 'text', id: generateUniqueId(), text: 'New Text', x: 50, y: 50, fill: textColor, fontFamily },
      ];
      if (saveHistory) {
        saveHistory(newElements);
      }
      return newElements;
    });
  };

  return (
    <button onClick={handleAddText} className="p-2 bg-green-500 text-white rounded">
      Add Text
    </button>
  );
};

export default AddTextButton;