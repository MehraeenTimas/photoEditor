'use client';
import React, { useEffect } from 'react';

const DeleteButton = ({ selectedId, setElements, setSelectedId, saveHistory, elements }) => {
  const handleDelete = () => {
    if (selectedId) {
      const newElements = elements.filter((el) => el.id !== selectedId);
      saveHistory(newElements);
      setElements(newElements);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedId) {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, elements]);

  return (
    <button
      onClick={handleDelete}
      disabled={!selectedId}
className="p-2 bg-gray-500 text-white rounded"
    >
      Delete Selected
    </button>
  );
};

export default DeleteButton;