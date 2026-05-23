import { ImagePlus } from 'lucide-react';
export default function AddImageButton({ setElements, saveHistory }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      saveHistory();
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          setElements(prev => [...prev, { id: `img_${Date.now()}`, type: 'image', img, x: 50, y: 50, width: 200, height: (200 * img.height) / img.width }]);
        };
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <label className="flex items-center gap-2 w-full bg-[#333] hover:bg-[#444] text-gray-200 text-xs px-3 py-2 rounded cursor-pointer transition-colors border border-[#444]">
      <ImagePlus size={14} /> Add Image
      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </label>
  );
}
