'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, AlertTriangle, Monitor, X } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Canvas to fix the "window is not defined" SSR error
const Canvas = dynamic(() => import('./components/Canvas'), { ssr: false });

import AddImageButton from './components/AddImageButton';
import BgColorPicker from './components/BgColorPicker';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';
import Export from './components/Export';
import DeleteButton from './components/DeleteButton';
import LayerControls from './components/LayerControls';

// Combined Tools
import UniversalColorPicker from './components/UniversalColorPicker';
import ShapeTool from './components/ShapeTool';
import TextTool from './components/TextTool';
import BrushTool from './components/BrushTool';

const RATIOS = {
  '1:1 (Square)': { width: 1080, height: 1080 },
  '4:3 (Standard)': { width: 1024, height: 768 },
  '16:9 (Widescreen)': { width: 1920, height: 1080 },
  '9:16 (Story/Reel)': { width: 1080, height: 1920 },
};

export default function Home() {
  const [elements, setElements] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [brushMode, setBrushMode] = useState(false);
  const [brushType, setBrushType] = useState('brush');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [selectedRatio, setSelectedRatio] = useState('16:9 (Widescreen)');
  const logicalSize = RATIOS[selectedRatio];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
    
    const saved = localStorage.getItem('editor_elements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const restored = parsed.map(el => {
          if (el.type === 'image' && el.imgSrc) {
            const img = new window.Image();
            img.src = el.imgSrc;
            return { ...el, img };
          }
          return el;
        });
        setElements(restored);
      } catch (e) {
        console.error("Failed to load from local storage", e);
      }
    }
    setIsLoaded(true);

    const handleClickOutside = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setIsActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const serialized = elements.map(el =>
      el.type === 'image' && el.img ? { ...el, imgSrc: el.img.src } : el
    );
    localStorage.setItem('editor_elements', JSON.stringify(serialized));
  }, [elements, isLoaded]);

  const saveHistory = () => {
    const serializedElements = elements.map((el) => {
      if (el.type === 'image' && el.img) {
        return { ...el, imgSrc: el.img.src };
      }
      return el;
    });
    setHistory((prev) => [...prev, serializedElements]);
    setRedoStack([]); 
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleClearCanvasClick = () => {
    setIsActionsOpen(false);
    setShowClearConfirm(true);
  };

  const confirmClearCanvas = () => {
    saveHistory(); 
    setElements([]);
    setBgColor('#ffffff');
    localStorage.removeItem('editor_elements');
    setShowClearConfirm(false);
  };

  return (
    <div className="h-screen w-full bg-[#1e1e1e] text-[#d4d4d4] flex flex-col font-sans overflow-hidden select-none">
      
      {/* Clear Canvas Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#252526] border border-[#3c3c3c] p-6 rounded shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Clear Canvas?</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              This will delete all current layers and progress. You can undo this action.
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-1.5 text-sm font-medium text-gray-300 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClearCanvas}
                className="px-4 py-1.5 text-sm font-medium text-white bg-[#005fb8] hover:bg-[#0078d4] rounded transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#252526] border-b border-[#333333] h-12 px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-[#ec3975] rounded flex items-center justify-center text-white font-bold text-xs">
            CP
          </div>
          <h1 className="text-xs font-semibold tracking-wider text-gray-200 hidden sm:block">CoPixel</h1>
        </div>
        
        {/* Desktop Tools Row */}
        <div className="hidden md:flex items-center gap-2 h-full">
          <div className="flex items-center gap-1 border-r border-[#333] pr-2 mr-2 h-6">
            <UndoButton history={history} setHistory={setHistory} setElements={setElements} setRedoStack={setRedoStack} elements={elements} />
            <RedoButton redoStack={redoStack} setRedoStack={setRedoStack} setElements={setElements} setHistory={setHistory} elements={elements} />
          </div>
          <div className="flex items-center gap-1 border-r border-[#333] pr-2 mr-2 h-6">
             <LayerControls selectedId={selectedId} elements={elements} setElements={setElements} saveHistory={saveHistory} />
          </div>
          <div className="flex items-center gap-1 border-r border-[#333] pr-2 mr-2 h-6">
             <DeleteButton selectedId={selectedId} setElements={setElements} setSelectedId={setSelectedId} saveHistory={saveHistory} elements={elements} />
          </div>
          <div className="flex items-center gap-2 border-r border-[#333] pr-2 mr-2 h-6">
            <Monitor size={14} className="text-gray-400" />
            <select 
              value={selectedRatio}
              onChange={(e) => setSelectedRatio(e.target.value)}
              className="bg-transparent text-xs text-gray-300 border-none outline-none cursor-pointer hover:text-white"
            >
              {Object.keys(RATIOS).map(ratio => (
                <option key={ratio} value={ratio} className="bg-[#252526]">{ratio}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setShowClearConfirm(true)} 
            className="text-xs px-3 py-1 text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
          <Export stageRef={stageRef} hideTransformer={() => canvasRef.current?.hideTransformer()} />
        </div>

        {/* Mobile Actions Dropdown */}
        <div className="relative md:hidden" ref={actionsRef}>
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="p-1.5 hover:bg-[#333] rounded transition-colors text-gray-300 flex items-center gap-1"
          >
            <Settings size={18} />
          </button>
          
          {isActionsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#252526] border border-[#333] shadow-xl rounded flex flex-col py-2 z-50">
              <div className="px-3 py-1 flex justify-between gap-1">
                 <UndoButton history={history} setHistory={setHistory} setElements={setElements} setRedoStack={setRedoStack} elements={elements} />
                 <RedoButton redoStack={redoStack} setRedoStack={setRedoStack} setElements={setElements} setHistory={setHistory} elements={elements} />
              </div>
              <div className="px-3 py-1 flex justify-between gap-1">
                  <LayerControls selectedId={selectedId} elements={elements} setElements={setElements} saveHistory={saveHistory} />
                  <DeleteButton selectedId={selectedId} setElements={setElements} setSelectedId={setSelectedId} saveHistory={saveHistory} elements={elements} />
              </div>
              <div className="h-px bg-[#333] my-2" />
              <div className="px-3 py-1">
                <select 
                  value={selectedRatio}
                  onChange={(e) => setSelectedRatio(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
                >
                  {Object.keys(RATIOS).map(ratio => (
                    <option key={ratio} value={ratio}>{ratio}</option>
                  ))}
                </select>
              </div>
              <div className="h-px bg-[#333] my-2" />
              <div className="px-3 py-1 flex flex-col gap-2">
                <button onClick={handleClearCanvasClick} className="w-full text-left text-xs text-red-400 hover:text-red-300 py-1">Clear Canvas</button>
                <Export stageRef={stageRef} hideTransformer={() => canvasRef.current?.hideTransformer()} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative bg-[#1e1e1e]">
        
        {/* Sidebar */}
        <aside
          className={`
            z-30 bg-[#252526] border-r border-[#333] transition-all duration-300 ease-in-out shrink-0 h-full flex flex-col
            ${isSidebarOpen ? 'w-full sm:w-64' : 'w-0 border-none'}
          `}
        >
          <div className={`h-full overflow-y-auto w-full sm:w-64 transition-opacity duration-300 custom-scrollbar ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            
            {/* Mobile Close */}
            <div className="flex justify-between items-center sm:hidden p-3 border-b border-[#333]">
              <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Properties</span>
              <button onClick={toggleSidebar} className="p-1 hover:bg-[#333] rounded"><X size={16} /></button>
            </div>

            <div className="flex flex-col">
              {/* Accordion-style panels */}
              <div className="border-b border-[#333] p-3">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">General</h3>
                <div className="flex flex-col gap-2">
                  <AddImageButton setElements={setElements} saveHistory={saveHistory} />
                  <UniversalColorPicker currentColor={currentColor} setCurrentColor={setCurrentColor} setElements={setElements} selectedId={selectedId} saveHistory={saveHistory} />
                  <BgColorPicker setBgColor={setBgColor} />
                </div>
              </div>

              <div className="border-b border-[#333] p-3">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Tools</h3>
                <div className="flex flex-col gap-2">
                  <ShapeTool setElements={setElements} saveHistory={saveHistory} currentColor={currentColor} />
                  <TextTool elements={elements} setElements={setElements} saveHistory={saveHistory} currentColor={currentColor} selectedId={selectedId} />
                </div>
              </div>

              <div className="border-b border-[#333] p-3">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Brush</h3>
                <BrushTool isDrawing={brushMode} setIsDrawing={setBrushMode} brushSize={brushSize} setBrushSize={setBrushSize} brushType={brushType} setBrushType={setBrushType} />
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar Toggle Button */}
        <div className="relative z-40 flex items-center h-full">
          <button 
            onClick={toggleSidebar}
            className="absolute left-0 w-4 h-12 bg-[#333] border border-[#444] rounded-r flex items-center justify-center hover:bg-[#444] text-gray-400 hover:text-white transition-colors "
          >
            {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Canvas Area */}
        <main className="flex-1 p-4 bg-[#121212] overflow-hidden relative flex items-center justify-center checkerboard-bg">
          <Canvas
            ref={canvasRef}
            elements={elements}
            setElements={setElements}
            bgColor={bgColor}
            brushMode={brushMode}
            brushType={brushType}
            brushColor={currentColor}
            brushSize={brushSize}
            stageRef={stageRef}
            saveHistory={saveHistory}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            logicalSize={logicalSize}
          />
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #252526; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        .checkerboard-bg {
          background-image: linear-gradient(45deg, #1a1a1a 25%, transparent 25%), 
                            linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #1a1a1a 75%), 
                            linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}
