'use client';
import React, { useState, useRef } from 'react';
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
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  return (
    <div className="flex h-screen p-4">
      <div className="w-3/4">
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
      <div className="w-1/4 flex flex-col gap-4 p-4 bg-gray-100">
        <AddImageButton setElements={setElements} saveHistory={canvasRef.current?.saveHistory} />
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
        <AddShapeTool setElements={setElements} saveHistory={canvasRef.current?.saveHistory} />
        <BgColorPicker setBgColor={setBgColor} />
        <BrushModeButton brushMode={brushMode} setBrushMode={setBrushMode} />
        <BrushColorPicker setBrushColor={setBrushColor} />
        <BrushSizePicker setBrushSize={setBrushSize} />
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
        <Export stageRef={stageRef} hideTransformer={() => canvasRef.current?.hideTransformer()} />
      </div>
    </div>
  );
}