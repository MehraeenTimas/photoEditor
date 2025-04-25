'use client';
import React from 'react';

const LayerControls = ({ selectedId, elements, setElements, saveHistory }) => {
  const handleBringToFront = () => {
    if (!selectedId) return;
    const element = elements.find((el) => el.id === selectedId);
    const newElements = [...elements.filter((el) => el.id !== selectedId), element];
    saveHistory(newElements);
    setElements(newElements);
  };

  const handleSendToBack = () => {
    if (!selectedId) return;
    const element = elements.find((el) => el.id === selectedId);
    const newElements = [element, ...elements.filter((el) => el.id !== selectedId)];
    saveHistory(newElements);
    setElements(newElements);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleBringToFront}
        disabled={!selectedId}
        className={`p-2 ${selectedId ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded`}
      >
        Bring to Front
      </button>
      <button
        onClick={handleSendToBack}
        disabled={!selectedId}
        className={`p-2 ${selectedId ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded`}
      >
        Send to Back
      </button>
    </div>
  );
};

export default LayerControls;