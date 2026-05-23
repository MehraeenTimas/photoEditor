import { Trash2 } from 'lucide-react';
export default function DeleteButton({ selectedId, setElements, setSelectedId, saveHistory, elements }) {
  return (
    <button onClick={() => {
        if (!selectedId) return;
        saveHistory();
        setElements(elements.filter(el => el.id !== selectedId));
        setSelectedId(null);
      }}
      disabled={!selectedId}
      className="p-1.5 text-gray-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors" title="Delete Selected">
      <Trash2 size={16} />
    </button>
  );
}
