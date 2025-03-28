'use client';
import React from 'react';

const BgColorPicker = ({ setBgColor }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm">Background Color</label>
      <input
        type="color"
        onChange={(e) => setBgColor(e.target.value)}
        className="w-full h-10 cursor-pointer"
      />
    </div>
  );
};

export default BgColorPicker;