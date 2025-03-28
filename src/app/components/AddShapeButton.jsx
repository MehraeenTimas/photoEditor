'use client';
import React from 'react';

const AddShapeButton = ({ setElements }) => {
  const handleAddShape = () => {
    setElements((prev) => [
      ...prev,
      {
        type: 'shape',
        shape: 'rect', // Can add 'circle', etc., later
        id: Date.now(),
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        fill: '#ff0000', // Default red
      },
    ]);
  };

  return (
    <button
      onClick={handleAddShape}
      className="p-2 bg-purple-500 text-white rounded"
    >
      Add Rectangle
    </button>
  );
};

export default AddShapeButton;