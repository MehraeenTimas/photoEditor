export default function BgColorPicker({ setBgColor }) {
  return (
    <div className="flex items-center gap-2 bg-[#1e1e1e] p-2 rounded border border-[#333]">
      <span className="text-xs text-gray-300 flex-1">Background</span>
      <input type="color" defaultValue="#ffffff" onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent" />
    </div>
  );
}
