import { Undo2 } from 'lucide-react';
export default function UndoButton({ history, setHistory, setElements, setRedoStack, elements }) {
  return (
    <button onClick={() => {
        if (history.length === 0) return;
        const previous = history[history.length - 1];
        setRedoStack(prev => [...prev, elements]);
        setElements(previous);
        setHistory(prev => prev.slice(0, -1));
      }} 
      disabled={history.length === 0}
      className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors" title="Undo">
      <Undo2 size={16} />
    </button>
  );
}
