'use client';

import React, { useState, useRef, useEffect } from 'react';
import Canvas from './components/Canvas';
import AddImageButton from './components/AddImageButton';
import AddTextButton from './components/AddTextButton';
import TextColorPicker from './components/TextColorPicker';
import BrushModeButton from './components/BrushModeButton';
import BrushColorPicker from './components/BrushColorPicker';
import BrushSizePicker from './components/BrushSizePicker';
import BgColorPicker from './components/BgColorPicker';
import UndoButton from './components/UndoButton';
import RedoButton from './components/RedoButton';
import Export from './components/Export';
import DeleteButton from './components/DeleteButton';
import LayerControls from './components/LayerControls';
import AddShapeTool from './components/AddShapeTool';
import FontPicker from './components/FontPicker';

export default function Home() {
  const [elements, setElements] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [brushMode, setBrushMode] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log(history);
  }, [history]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Photo Editor</h1>
        <div className="flex gap-2">
          <Export
            stageRef={stageRef}
            hideTransformer={() => canvasRef.current?.hideTransformer()}
          />
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-400 rounded-md hover:bg-gray-300"
          >
            {isSidebarOpen ? 'Hide Tools' : 'Show Tools'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Sidebar (Collapsible) */}
        <aside
          className={`bg-white  p-4  ${
            isSidebarOpen ? 'w-64' : 'w-0'
          } overflow-y-auto`}
        >
          {isSidebarOpen && (
            <div className="flex flex-col gap-6">
              {/* Image and Shape Tools */}
              <div className="">

                <AddImageButton
                  setElements={setElements}
                  saveHistory={canvasRef.current?.saveHistory}
                />
                <AddShapeTool
                  setElements={setElements}
                  saveHistory={canvasRef.current?.saveHistory}
                />
              </div>

              {/* Text Tools */}
              <div className="">

                <AddTextButton
                  setElements={setElements}
                  textColor={textColor}
                  fontFamily={fontFamily}
                  saveHistory={canvasRef.current?.saveHistory}
                />
                <TextColorPicker setTextColor={setTextColor} />
                <FontPicker
                  setFontFamily={setFontFamily}
                  selectedId={selectedId}
                  elements={elements}
                  setElements={setElements}
                  saveHistory={canvasRef.current?.saveHistory}
                />
              </div>

              {/* Brush Tools */}
              <div className="">

                <BrushModeButton brushMode={brushMode} setBrushMode={setBrushMode} />
                <BrushColorPicker setBrushColor={setBrushColor} />
                <BrushSizePicker setBrushSize={setBrushSize} />
              </div>

              {/* Background and Layers */}
              <div>

                <BgColorPicker setBgColor={setBgColor} />
              
              </div>
            </div>
          )}
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <Canvas
              ref={canvasRef}
              elements={elements}
              setElements={setElements}
              bgColor={bgColor}
              brushMode={brushMode}
              brushColor={brushColor}
              brushSize={brushSize}
              stageRef={stageRef}
              history={history}
              setHistory={setHistory}
              setRedoStack={setRedoStack}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>
        </main>
      </div>

      {/* Bottom Toolbar */}
      <footer className="bg-white shadow-inner p-4 flex justify-center gap-4">
        <UndoButton
          history={history}
          setHistory={setHistory}
          setElements={setElements}
          setRedoStack={setRedoStack}
          elements={elements}
        />
        <RedoButton
          redoStack={redoStack}
          setRedoStack={setRedoStack}
          setElements={setElements}
          setHistory={setHistory}
          elements={elements}
        />
        <DeleteButton
          selectedId={selectedId}
          setElements={setElements}
          setSelectedId={setSelectedId}
          saveHistory={canvasRef.current?.saveHistory}
          elements={elements}
        />
          <LayerControls
                  selectedId={selectedId}
                  elements={elements}
                  setElements={setElements}
                  saveHistory={canvasRef.current?.saveHistory}
                />
      </footer>
    </div>
  );
}