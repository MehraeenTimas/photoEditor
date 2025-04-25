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
    <div {...getRootProps()} className="p-2 bg-gray-500 text-white rounded mb-2" >
      <input {...getInputProps()}  />
       <p className="text-center" >Add Image</p> 
    </div>
  );
};

export default AddImageButton;