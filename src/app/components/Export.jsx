'use client';
import React from 'react';

const Export = ({ stageRef, hideTransformer }) => {
  const handleExport = () => {
    if (!stageRef.current) {
      console.error('Stage ref is not available');
      return;
    }

    // Hide transformer before exporting
    hideTransformer();

    const stage = stageRef.current;
    const dataURL = stage.toDataURL({ pixelRatio: 2 }); // Higher resolution

    const link = document.createElement('a');
    link.download = 'collage.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
  className="p-2 bg-gray-500 text-white rounded"
    >
      Export as PNG
    </button>
  );
};

export default Export;