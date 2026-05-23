import { ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
export default function LayerControls({ selectedId, elements, setElements, saveHistory }) {
  const moveLayer = (direction) => {
    if (!selectedId) return;
    const index = elements.findIndex(el => el.id === selectedId);
    if (index < 0) return;
    if (direction === 'up' && index === elements.length - 1) return;
    if (direction === 'down' && index === 0) return;
    
    saveHistory();
    const newElements = [...elements];
    const targetIndex = direction === 'up' ? index + 1 : index - 1;
    [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];
    setElements(newElements);
  };

  return (
    <>
      <button onClick={() => moveLayer('up')} disabled={!selectedId} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors" title="Bring Forward"><ArrowUpToLine size={16} /></button>
      <button onClick={() => moveLayer('down')} disabled={!selectedId} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors" title="Send Backward"><ArrowDownToLine size={16} /></button>
    </>
  );
}
