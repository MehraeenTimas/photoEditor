'use client';
import React, { useState } from 'react';
import { generateUniqueId } from './utils'

const AddShapeTool = ({ setElements, saveHistory }) => {
  const [shapeType, setShapeType] = useState('rect');
  const [shapeColor, setShapeColor] = useState('#ff0000');

  const handleAddShape = () => {
    const shapeProps = {
      type: 'shape',
      shape: shapeType, // Explicitly set shape type
      id: generateUniqueId(),
      x: 50,
      y: 50,
      fill: shapeColor,
    };

    if (shapeType === 'rect') {
      shapeProps.width = 100;
      shapeProps.height = 100;
    } else if (shapeType === 'circle') {
      shapeProps.radius = 50;
    }

    setElements((prev) => {
      const newElements = [...prev, shapeProps];
      if (saveHistory) {
        saveHistory(newElements); // Ensure history is updated only if saveHistory exists
      }
      return newElements;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm">Add Shape</span>
      <select
        value={shapeType}
        onChange={(e) => setShapeType(e.target.value)}
        className="p-1 rounded border"
      >
        <option value="rect">Rectangle</option>
        <option value="circle">Circle</option>
      </select>
      <input
        type="color"
        value={shapeColor}
        onChange={(e) => setShapeColor(e.target.value)}
        className="w-full h-10 cursor-pointer"
      />
      <button
        onClick={handleAddShape}
        className="p-2 bg-purple-500 text-white rounded"
      >
        Add {shapeType === 'rect' ? 'Rectangle' : 'Circle'}
      </button>
    </div>
  );
};

export default AddShapeTool;