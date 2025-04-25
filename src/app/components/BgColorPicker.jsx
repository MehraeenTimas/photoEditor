'use client';
import React from 'react';

const BgColorPicker = ({ setBgColor }) => {
  return (
    <div className="flex flex-row items-center gap-2 p-2 bg-gray-500 rounded">
      <label className="">Background:</label>
      <input
        type="color"
        onChange={(e) => setBgColor(e.target.value)}
        className="w-full h-8 cursor-pointer"
      />
    </div>
  );
};

export default BgColorPicker;