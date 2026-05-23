import { Redo2 } from 'lucide-react';
export default function RedoButton({ redoStack, setRedoStack, setElements, setHistory, elements }) {
  return (
    <button onClick={() => {
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        setHistory(prev => [...prev, elements]);
        setElements(next);
        setRedoStack(prev => prev.slice(0, -1));
      }} 
      disabled={redoStack.length === 0}
      className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors" title="Redo">
      <Redo2 size={16} />
    </button>
  );
}
