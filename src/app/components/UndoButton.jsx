'use client';
import React from 'react';

const UndoButton = ({ history, setHistory, setElements, setRedoStack, elements }) => {
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1].map((el) => {
      if (el.type === 'image' && el.imgSrc) {
        const img = new window.Image();
        img.src = el.imgSrc;
        return { ...el, img };
      }
      return el;
    });
    setRedoStack((prev) => [...prev, elements]);
    setHistory(history.slice(0, -1));
    setElements(previous);
    if (typeof window !== 'undefined') {
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.dispatchEvent(new Event('click')); // Deselect
    }
  };

  return (
    <button onClick={handleUndo} disabled={history.length === 0} className="p-2 bg-orange-500 text-white rounded disabled:bg-gray-400">
      Undo
    </button>
  );
};

export default UndoButton;