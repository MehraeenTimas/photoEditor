'use client';
import React from 'react';
import Button from '@mui/material/Button';
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
    <button  onClick={handleAddText} className=" p-2 w-full bg-gray-500 text-white mb-2 rounded">
      Add Text
    </button>
  );
};

export default AddTextButton;