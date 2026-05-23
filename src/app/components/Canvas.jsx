import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Circle, RegularPolygon, Text, Line, Transformer } from 'react-konva';

const Canvas = forwardRef(({ elements, setElements, bgColor, brushMode, brushType, brushColor, brushSize, stageRef, saveHistory, selectedId, setSelectedId, logicalSize }, ref) => {
  const [scale, setScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [editingText, setEditingText] = useState(null);

  const containerRef = React.useRef(null);
  const transformerRef = React.useRef(null);
  const isDrawingRef = React.useRef(false);

  useImperativeHandle(ref, () => ({
    hideTransformer: () => setSelectedId(null)
  }));

  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
        
        const scaleX = (clientWidth * 0.95) / logicalSize.width;
        const scaleY = (clientHeight * 0.95) / logicalSize.height;
        setScale(Math.min(scaleX, scaleY));
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [logicalSize]);

  useEffect(() => {
    if (transformerRef.current) {
      if (selectedId && !editingText) {
        const node = stageRef.current.findOne(`#${selectedId}`);
        if (node) {
          transformerRef.current.nodes([node]);
          transformerRef.current.getLayer().batchDraw();
        } else {
          transformerRef.current.nodes([]);
        }
      } else {
        transformerRef.current.nodes([]);
      }
    }
  }, [selectedId, elements, stageRef, editingText]);

  const handlePointerDown = (e) => {
    if (editingText) return; // Prevent new drawing or losing focus while editing
    
    if (e.target === e.target.getStage()) setSelectedId(null);
    if (!brushMode) return;
    
    isDrawingRef.current = true;
    saveHistory();
    const pos = e.target.getStage().getPointerPosition();
    const id = `brush_${Date.now()}`;
    const newElement = {
      id,
      type: 'brush',
      tool: brushType,
      points: [pos.x / scale, pos.y / scale],
      stroke: brushColor,
      strokeWidth: brushSize,
    };
    setElements([...elements, newElement]);
  };

  const handlePointerMove = (e) => {
    if (!brushMode || !isDrawingRef.current || editingText) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    setElements(prevElements => {
      const lastElement = { ...prevElements[prevElements.length - 1] };
      lastElement.points = lastElement.points.concat([point.x / scale, point.y / scale]);
      return [...prevElements.slice(0, -1), lastElement];
    });
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleDragEnd = (e, id) => {
    const node = e.target;
    setElements(elements.map(el => el.id === id ? { ...el, x: node.x(), y: node.y() } : el));
  };

  const handleTransformEnd = (e, id) => {
    const node = e.target;
    setElements(elements.map(el => {
      if (el.id === id) {
        return {
          ...el,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        };
      }
      return el;
    }));
  };

  // Text Edit Handling
  const handleTextDblClick = (e, id) => {
    const textNode = e.target;
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();
    
    setEditingText({
      id,
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
      width: textNode.width() * textNode.scaleX() * scale,
      height: textNode.height() * textNode.scaleY() * scale,
      text: textNode.text(),
      fontSize: textNode.fontSize() * textNode.scaleY() * scale,
      fontStyle: textNode.fontStyle(),
      textDecoration: textNode.textDecoration(),
      rotation: textNode.rotation()
    });
  };

  const handleTextareaChange = (e) => {
    setEditingText(prev => ({ ...prev, text: e.target.value }));
  };

  const handleTextareaBlur = () => {
    saveHistory();
    setElements(elements.map(el => el.id === editingText.id ? { ...el, text: editingText.text } : el));
    setEditingText(null);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative">
      <div 
        style={{ 
          width: logicalSize.width * scale, 
          height: logicalSize.height * scale,
          backgroundColor: bgColor,
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        <Stage
          width={logicalSize.width * scale}
          height={logicalSize.height * scale}
          scaleX={scale}
          scaleY={scale}
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={brushMode ? 'cursor-crosshair' : 'cursor-default'}
        >
          <Layer>
            {elements.map((el) => {
              const isEditing = editingText && editingText.id === el.id;
              const commonProps = {
                id: el.id,
                x: el.x || 0,
                y: el.y || 0,
                rotation: el.rotation || 0,
                scaleX: el.scaleX || 1,
                scaleY: el.scaleY || 1,
                draggable: !brushMode,
                onClick: () => !brushMode && setSelectedId(el.id),
                onTap: () => !brushMode && setSelectedId(el.id),
                onDragStart: saveHistory,
                onDragEnd: (e) => handleDragEnd(e, el.id),
                onTransformStart: saveHistory,
                onTransformEnd: (e) => handleTransformEnd(e, el.id),
              };

              switch (el.type) {
                case 'image': return <KonvaImage key={el.id} {...commonProps} image={el.img} width={el.width} height={el.height} />;
                case 'rect': return <Rect key={el.id} {...commonProps} width={el.width} height={el.height} fill={el.fill} />;
                case 'circle': return <Circle key={el.id} {...commonProps} radius={el.radius} fill={el.fill} />;
                case 'triangle': return <RegularPolygon key={el.id} {...commonProps} sides={3} radius={el.radius} fill={el.fill} />;
                case 'text': return (
                  <Text 
                    key={el.id} 
                    {...commonProps} 
                    text={el.text} 
                    fontSize={el.fontSize} 
                    fill={el.fill} 
                    width={el.width}
                    fontStyle={el.fontStyle}
                    textDecoration={el.textDecoration}
                    padding={5} 
                    visible={!isEditing}
                    onDblClick={(e) => handleTextDblClick(e, el.id)}
                    onDblTap={(e) => handleTextDblClick(e, el.id)}
                  />
                );
                case 'brush': return (
                  <Line 
                    key={el.id} 
                    points={el.points} 
                    stroke={el.stroke} 
                    strokeWidth={el.strokeWidth} 
                    tension={0.5} 
                    lineCap="round" 
                    lineJoin="round" 
                    globalCompositeOperation={el.tool === 'eraser' ? 'destination-out' : 'source-over'} 
                  />
                );
                default: return null;
              }
            })}
            <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => newBox.width < 5 || newBox.height < 5 ? oldBox : newBox} />
          </Layer>
        </Stage>
      </div>

      {editingText && (
        <textarea
          autoFocus
          value={editingText.text}
          onChange={handleTextareaChange}
          onBlur={handleTextareaBlur}
          style={{
            position: 'absolute',
            top: editingText.y,
            left: editingText.x,
            width: editingText.width,
            height: editingText.height,
            fontSize: `${editingText.fontSize}px`,
            fontStyle: editingText.fontStyle?.includes('italic') ? 'italic' : 'normal',
            fontWeight: editingText.fontStyle?.includes('bold') ? 'bold' : 'normal',
            textDecoration: editingText.textDecoration,
            color: '#000',
            transform: `rotateZ(${editingText.rotation}deg)`,
            transformOrigin: 'top left',
            background: 'none',
            border: '1px dashed #005fb8',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            margin: 0,
            padding: '5px',
          }}
        />
      )}
    </div>
  );
});

Canvas.displayName = 'Canvas';
export default Canvas;
