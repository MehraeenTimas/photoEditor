import React from 'react';
import { PenTool, Eraser } from 'lucide-react';

export default function BrushTool({ isDrawing, setIsDrawing, brushSize, setBrushSize, brushType, setBrushType }) {
  
  const handleBrushClick = () => {
    if (isDrawing && brushType === 'brush') {
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
      setBrushType('brush');
    }
  };

  const handleEraserClick = () => {
    if (isDrawing && brushType === 'eraser') {
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
      setBrushType('eraser');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button 
          onClick={handleBrushClick}
          className={`flex-1 flex items-center justify-center gap-2 text-xs px-3 py-2 rounded transition-colors border ${isDrawing && brushType === 'brush' ? 'bg-[#005fb8] border-[#005fb8] text-white' : 'bg-[#333] hover:bg-[#444] text-gray-200 border-[#444]'}`}
        >
          <PenTool size={14} /> Brush
        </button>
        <button 
          onClick={handleEraserClick}
          className={`flex-1 flex items-center justify-center gap-2 text-xs px-3 py-2 rounded transition-colors border ${isDrawing && brushType === 'eraser' ? 'bg-[#005fb8] border-[#005fb8] text-white' : 'bg-[#333] hover:bg-[#444] text-gray-200 border-[#444]'}`}
        >
          <Eraser size={14} /> Eraser
        </button>
      </div>
      
      {isDrawing && (
        <div className="bg-[#1e1e1e] p-2 rounded border border-[#333] flex flex-col gap-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Size</span>
            <span>{brushSize}px</span>
          </div>
          <input 
            type="range" min="1" max="100" value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full accent-[#005fb8]"
          />
        </div>
      )}
    </div>
  );
}
