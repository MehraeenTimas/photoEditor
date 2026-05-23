import { useState } from 'react';
import { Type, Bold, Italic, Underline } from 'lucide-react';

export default function TextTool({ elements = [], setElements, saveHistory, currentColor, selectedId }) {
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(24);

  const selectedText = elements.find(el => el.id === selectedId && el.type === 'text');

  const updateSelectedText = (updates) => {
    if (!selectedId) return;
    saveHistory();
    setElements((prev) => prev.map((el) => 
      el.id === selectedId && el.type === 'text' ? { ...el, ...updates } : el
    ));
  };

  const handleFontChange = (e) => {
    setFontFamily(e.target.value);
    updateSelectedText({ fontFamily: e.target.value });
  };

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10) || 24;
    setFontSize(size);
    updateSelectedText({ fontSize: size });
  };

  const toggleStyle = (style) => {
    if (!selectedText) return;
    let currentStyles = selectedText.fontStyle || '';
    
    if (currentStyles.includes(style)) {
      currentStyles = currentStyles.replace(style, '').trim();
    } else {
      currentStyles = `${currentStyles} ${style}`.trim();
    }
    
    updateSelectedText({ fontStyle: currentStyles });
  };

  const toggleDecoration = () => {
    if (!selectedText) return;
    const currentDeco = selectedText.textDecoration || '';
    updateSelectedText({ textDecoration: currentDeco === 'underline' ? '' : 'underline' });
  };

  const handleAddText = () => {
    saveHistory();
    const newText = {
      id: Date.now().toString(),
      type: 'text',
      x: 150,
      y: 150,
      text: 'Double click to edit',
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: currentColor,
      draggable: true,
      fontStyle: 'normal',
      textDecoration: 'none',
    };
    setElements((prev) => [...prev, newText]);
  };

  return (
    <div className="flex flex-col gap-2">
      <button onClick={handleAddText} className="flex items-center justify-center gap-2 w-full bg-[#333] hover:bg-[#444] text-gray-200 text-xs px-3 py-2 rounded transition-colors border border-[#444]">
        <Type size={14} /> Add Text
      </button>

      {selectedText && (
        <div className="flex flex-col gap-2 mt-2 bg-[#1e1e1e] p-2 rounded border border-[#333]">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Size</span>
            <input 
              type="number" 
              value={selectedText.fontSize} 
              onChange={handleSizeChange}
              className="w-16 bg-[#252526] text-white border border-[#444] rounded px-1 py-0.5 text-center"
            />
          </div>
          
          <div className="flex gap-1 justify-between">
            <button 
              onClick={() => toggleStyle('bold')}
              className={`p-1.5 rounded flex-1 flex justify-center border transition-colors ${selectedText.fontStyle?.includes('bold') ? 'bg-[#005fb8] border-[#005fb8] text-white' : 'bg-[#333] border-[#444] text-gray-300 hover:bg-[#444]'}`}
            >
              <Bold size={14} />
            </button>
            <button 
              onClick={() => toggleStyle('italic')}
              className={`p-1.5 rounded flex-1 flex justify-center border transition-colors ${selectedText.fontStyle?.includes('italic') ? 'bg-[#005fb8] border-[#005fb8] text-white' : 'bg-[#333] border-[#444] text-gray-300 hover:bg-[#444]'}`}
            >
              <Italic size={14} />
            </button>
            <button 
              onClick={toggleDecoration}
              className={`p-1.5 rounded flex-1 flex justify-center border transition-colors ${selectedText.textDecoration === 'underline' ? 'bg-[#005fb8] border-[#005fb8] text-white' : 'bg-[#333] border-[#444] text-gray-300 hover:bg-[#444]'}`}
            >
              <Underline size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
