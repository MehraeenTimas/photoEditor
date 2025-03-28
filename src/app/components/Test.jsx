'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { useDropzone } from 'react-dropzone';

const Test = () => {
  const [images, setImages] = useState([]);
  const stageRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      return { img, x: 50, y: 50 }; // Initial position
    });
    setImages((prev) => [...prev, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed gray',
          padding: '20px',
          marginBottom: '10px',
          textAlign: 'center',
        }}
      >
        <input {...getInputProps()} />
        <p>Drag & drop photos here, or click to select</p>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 100}
        ref={stageRef}
      >
        <Layer>
          {images.map((image, index) => (
            <KonvaImage
              key={index}
              image={image.img}
              x={image.x}
              y={image.y}
              draggable // Allow dragging
              onDragEnd={(e) => {
                const newImages = [...images];
                newImages[index] = {
                  ...image,
                  x: e.target.x(),
                  y: e.target.y(),
                };
                setImages(newImages);
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Test;