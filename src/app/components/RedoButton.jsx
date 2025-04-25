'use client';
import React from 'react';

const RedoButton = ({ redoStack, setRedoStack, setElements, setHistory, elements }) => {
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1].map((el) => {
      if (el.type === 'image' && el.imgSrc) {
        const img = new window.Image();
        img.src = el.imgSrc;
        return { ...el, img };
      }
      return el;
    });
    setHistory((prev) => [...prev, elements]);
    setRedoStack(redoStack.slice(0, -1));
    setElements(next);
  };

  return (
    <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-2 bg-teal-500 text-white rounded disabled:bg-gray-500">
      Redo
    </button>
  );
};

export default RedoButton;