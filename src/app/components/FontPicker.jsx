'use client';
import React, { useState } from 'react';

const FontPicker = ({ setFontFamily, selectedId, elements, setElements, saveHistory }) => {
  const [font, setFont] = useState('Arial'); // Default font

  const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  const handleFontChange = (e) => {
    const newFont = e.target.value;
    setFont(newFont);
    setFontFamily(newFont);

    // Apply to selected text if any
    if (selectedId) {
      const newElements = elements.map((el) =>
        el.id === selectedId && el.type === 'text' ? { ...el, fontFamily: newFont } : el
      );
      saveHistory(newElements);
      setElements(newElements);
    }
  };

  return (
    <div className="p-2 bg-gray-500 text-white rounded">
      <label className="">Font:</label>
      <select
        value={font}
        onChange={handleFontChange}
        className="p-1 rounded  border-0"
      >
        {fonts.map((fontOption) => (
          <option key={fontOption} value={fontOption}>
            {fontOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontPicker;