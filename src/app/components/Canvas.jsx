'use client';
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer, Rect, Line, Circle } from 'react-konva';
import { generateUniqueId } from './utils';

const Canvas = forwardRef(({ elements, setElements, bgColor, brushMode, brushColor, brushSize, stageRef, history, setHistory, setRedoStack, selectedId, setSelectedId }, ref) => {
  const trRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const saveHistory = (newElements) => {
    const serializedElements = newElements.map((el) => {
      if (el.type === 'image' && el.img) {
        return { ...el, imgSrc: el.img.src };
      }
      return el;
    });
    setHistory([...history, serializedElements]);
    setRedoStack([]);
    setElements(newElements);
  };

  const handleSelect = (e, id) => {
    setSelectedId(id);
    if (trRef.current) {
      trRef.current.nodes([e.target]);
      trRef.current.getLayer().batchDraw();
    }
  };

  const handleTransformEnd = (e, id) => {
    const node = e.target;
    const newElements = elements.map((el) =>
      el.id === id
        ? { ...el, x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() }
        : el
    );
    saveHistory(newElements);
  };

  const handleBrushStart = (e) => {
    if (!brushMode) return;
    setIsDrawing(true);
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    setCurrentLine({ id: generateUniqueId(), points: [pos.x, pos.y], color: brushColor, size: brushSize });
  };

  const handleBrushMove = (e) => {
    if (!brushMode || !isDrawing || !currentLine) return;
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    setCurrentLine((prev) => ({
      ...prev,
      points: [...prev.points, pos.x, pos.y],
    }));
  };

  const handleBrushEnd = () => {
    if (!brushMode || !isDrawing || !currentLine) return;
    setIsDrawing(false);
    const newElements = [...elements, { type: 'brush', ...currentLine }];
    saveHistory(newElements);
    setCurrentLine(null);
  };

  const handleTextEdit = (e, el) => {
    const textNode = e.target;
    setEditingId(el.id);

    const stage = textNode.getStage();
    const textPosition = textNode.absolutePosition();
    const rotation = textNode.rotation();
    const scaleX = textNode.scaleX();
    const scaleY = textNode.scaleY();

    textNode.hide();
    stage.draw();

    const input = document.createElement('input');
    input.type = 'text';
    input.value = textNode.text();
    input.style.position = 'absolute';
    input.style.top = `${textPosition.y}px`;
    input.style.left = `${textPosition.x}px`;
    input.style.width = `${textNode.width() * scaleX}px`;
    input.style.height = `${textNode.height() * scaleY}px`;
    input.style.fontSize = `${textNode.fontSize() * scaleX}px`;
    input.style.color = textNode.fill();
    input.style.transform = `rotate(${rotation}deg)`;
    input.style.transformOrigin = 'top left';
    input.style.border = '1px solid #ccc';
    input.style.padding = '2px';
    input.style.background = 'rgba(255, 255, 255, 0.9)';
    input.style.outline = 'none';

    document.body.appendChild(input);
    input.focus();
    input.select();

    const finishEditing = () => {
      const newText = input.value;
      const newElements = elements.map((item) =>
        item.id === el.id ? { ...item, text: newText } : item
      );
      saveHistory(newElements);
      document.body.removeChild(input);
      textNode.show();
      stage.draw();
      setEditingId(null);
    };

    input.addEventListener('blur', finishEditing);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        finishEditing();
      } else if (event.key === 'Escape') {
        document.body.removeChild(input);
        textNode.show();
        stage.draw();
        setEditingId(null);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    hideTransformer() {
      if (trRef.current) {
        trRef.current.nodes([]); // Fixed typo: 'threadss' -> 'nodes'
        trRef.current.getLayer().batchDraw();
      }
    },
    saveHistory,
  }));

  return (
    <Stage
      width={900}
      height={600}
      ref={stageRef}
      onMouseDown={brushMode ? handleBrushStart : undefined}
      onMouseMove={brushMode ? handleBrushMove : undefined}
      onMouseUp={brushMode ? handleBrushEnd : undefined}
    >
      <Layer>
        <Rect x={0} y={0} width={800} height={600} fill={bgColor} />
        {elements.map((el) => {
          if (el.type === 'image') {
            return (
              <KonvaImage
                key={el.id}
                id={el.id}
                image={el.img}
                x={el.x}
                y={el.y}
                scaleX={el.scaleX || 1}
                scaleY={el.scaleY || 1}
                rotation={el.rotation || 0}
                draggable
                onClick={(e) => handleSelect(e, el.id)}
                onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                onDragEnd={(e) => {
                  const newElements = elements.map((item) =>
                    item.id === el.id ? { ...item, x: e.target.x(), y: e.target.y() } : item
                  );
                  saveHistory(newElements);
                }}
              />
            );
          } else if (el.type === 'text') {
            return (
              <Text
                key={el.id}
                id={el.id}
                text={el.text}
                x={el.x}
                y={el.y}
                scaleX={el.scaleX || 1}
                scaleY={el.scaleY || 1}
                rotation={el.rotation || 0}
                fill={el.fill || '#000000'}
                draggable
                fontSize={20}
                fontFamily={el.fontFamily || 'Arial'}
                onClick={(e) => handleSelect(e, el.id)}
                onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                onDragEnd={(e) => {
                  const newElements = elements.map((item) =>
                    item.id === el.id ? { ...item, x: e.target.x(), y: e.target.y() } : item
                  );
                  saveHistory(newElements);
                }}
                onDblClick={(e) => handleTextEdit(e, el)}
                visible={editingId !== el.id}
              />
            );
          } else if (el.type === 'brush') {
            return (
              <Line
                key={el.id}
                id={el.id}
                points={el.points}
                stroke={el.color}
                strokeWidth={el.size || 5}
                lineCap="round"
                lineJoin="round"
              />
            );
          } else if (el.type === 'shape' && el.shape === 'rect') {
            return (
              <Rect
                key={el.id}
                id={el.id}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                fill={el.fill}
                scaleX={el.scaleX || 1}
                scaleY={el.scaleY || 1}
                rotation={el.rotation || 0}
                draggable
                onClick={(e) => handleSelect(e, el.id)}
                onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                onDragEnd={(e) => {
                  const newElements = elements.map((item) =>
                    item.id === el.id ? { ...item, x: e.target.x(), y: e.target.y() } : item
                  );
                  saveHistory(newElements);
                }}
              />
            );
          } else if (el.type === 'shape' && el.shape === 'circle') {
            return (
              <Circle
                key={el.id}
                id={el.id}
                x={el.x}
                y={el.y}
                radius={el.radius}
                fill={el.fill}
                scaleX={el.scaleX || 1}
                scaleY={el.scaleY || 1}
                rotation={el.rotation || 0}
                draggable
                onClick={(e) => handleSelect(e, el.id)}
                onTransformEnd={(e) => handleTransformEnd(e, el.id)}
                onDragEnd={(e) => {
                  const newElements = elements.map((item) =>
                    item.id === el.id ? { ...item, x: e.target.x(), y: e.target.y() } : item
                  );
                  saveHistory(newElements);
                }}
              />
            );
          }
        })}
        {currentLine && (
          <Line
            points={currentLine.points}
            stroke={currentLine.color}
            strokeWidth={currentLine.size || 5}
            lineCap="round"
            lineJoin="round"
          />
        )}
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          rotateEnabled={true}
        />
      </Layer>
    </Stage>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;