import { Palette } from 'lucide-react';
export default function UniversalColorPicker({ currentColor, setCurrentColor, setElements, selectedId, saveHistory }) {
  const handleColorChange = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
    if (selectedId) {
      saveHistory();
      setElements(prev => prev.map(el => {
        if (el.id === selectedId) {
          if (['rect', 'circle', 'triangle', 'text'].includes(el.type)) return { ...el, fill: color };
          if (el.type === 'brush') return { ...el, stroke: color };
        }
        return el;
      }));
    }
  };
  return (
    <div className="flex items-center gap-2 bg-[#1e1e1e] p-2 rounded border border-[#333]">
      <Palette size={14} className="text-gray-400" />
      <span className="text-xs text-gray-300 flex-1">Color</span>
      <input type="color" value={currentColor} onChange={handleColorChange} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" />
    </div>
  );
}
