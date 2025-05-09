import { WallpaperIcon } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import ItemsThemeSelector from "./ItemsThemeSelector";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const ExtraOptions = () => {
  const { bgType, textColor, updateBgType, backgroundColor } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    const newType = bgType === "image" ? "color" : "image";
    updateBgType(newType);
  };

  return (
    <div 
      className="w-90 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out shadow-xl flex flex-col gap-4"
      style={{ 
        backgroundColor: `${backgroundColor}10`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transform: isOpen ? 'translateY(0)' : 'translateY(calc(100% - 48px))',
        maxHeight: isOpen ? '80vh' : '48px',
      }}
    >
      <div 
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: textColor }}
      >
        <div className="flex items-center gap-2">
          <WallpaperIcon className="w-4 h-4" />
          <h2 className="font-medium">Extra Options</h2>
        </div>
        <button
          aria-label={isOpen ? "Collapse panel" : "Expand panel"}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
        >
          {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      <div className="p-4 overflow-y-auto max-h-[calc(80vh-48px)]">
        <div className="w-full flex flex-col gap-2">
          <span className="text-xs font-medium">Background Style</span>
          <div className="flex flex-col rounded-lg justify-center gap-2 p-2" style={{ backgroundColor: `${textColor}10` }}>
            <span className="custom-text-color">Random Background Images {bgType === "image" ? "On" : "Off"}</span>
            <button
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                bgType === "image" ? "bg-blue-500" : "bg-gray-400"
              }`}
              onClick={handleToggle}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  bgType === "image" ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
          <div className="h-px my-4" style={{ backgroundColor: `${textColor}20` }}></div>
          <ItemsThemeSelector />
        </div>
      </div>
    </div>
  )
};

export default ExtraOptions;