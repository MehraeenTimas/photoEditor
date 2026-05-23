import { Download } from 'lucide-react';
export default function Export({ stageRef, hideTransformer }) {
  const handleExport = () => {
    hideTransformer();
    setTimeout(() => {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'edited-photo.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 100);
  };
  return (
    <button onClick={handleExport} className="flex items-center gap-1 bg-[#005fb8] hover:bg-[#0078d4] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
      <Download size={14} /> Export
    </button>
  );
}
