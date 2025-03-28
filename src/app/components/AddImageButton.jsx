'use client';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { generateUniqueId } from './utils';

const AddImageButton = ({ setElements, saveHistory }) => {
  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      return { type: 'image', id: generateUniqueId(), img, x: 50, y: 50 };
    });
    setElements((prev) => {
      const newElements = [...prev, ...newImages];
      if (saveHistory) {
        saveHistory(newElements);
      }
      return newElements;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <div {...getRootProps()} className="p-4 bg-gray-200 border-2 border-dashed border-gray-400 text-center cursor-pointer">
      <input {...getInputProps()} />
      <p>Add Image (Drag or Click)</p>
    </div>
  );
};

export default AddImageButton;