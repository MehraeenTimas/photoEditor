import { Square, Circle as CircleIcon, Triangle } from 'lucide-react';
export default function ShapeTool({ setElements, saveHistory, currentColor }) {
  const addShape = (type) => {
    saveHistory();
    const base = { id: `shape_${Date.now()}`, type, x: 100, y: 100, fill: currentColor };
    if (type === 'rect') setElements(prev => [...prev, { ...base, width: 100, height: 100 }]);
    else setElements(prev => [...prev, { ...base, radius: 50 }]);
  };
  return (
    <div className="flex gap-2">
      <button onClick={() => addShape('rect')} className="flex-1 flex justify-center items-center bg-[#333] hover:bg-[#444] p-2 rounded border border-[#444] text-gray-300 transition-colors"><Square size={16} /></button>
      <button onClick={() => addShape('circle')} className="flex-1 flex justify-center items-center bg-[#333] hover:bg-[#444] p-2 rounded border border-[#444] text-gray-300 transition-colors"><CircleIcon size={16} /></button>
      <button onClick={() => addShape('triangle')} className="flex-1 flex justify-center items-center bg-[#333] hover:bg-[#444] p-2 rounded border border-[#444] text-gray-300 transition-colors"><Triangle size={16} /></button>
    </div>
  );
}
