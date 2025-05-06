import { WallpaperIcon } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const BackgroundSettings = () => {
  const { textColor } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [bgType, setBgType] = useState<"image" | "color">("color");

  useEffect(() => {
    chrome.storage.local.get(["bgType"], (result) => {
      if (result.bgType === "image" || result.bgType === "color") {
        setBgType(result.bgType);
      }
    });
  }, []);

  const handleToggle = () => {
    const newType = bgType === "image" ? "color" : "image";
    setBgType(newType);
    chrome.storage.local.set({ bgType: newType });
  };

  return (
    <div 
      className="w-80 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out shadow-xl flex flex-col gap-4"
      style={{ 
        backgroundColor: `${textColor === '#ffffff' ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.85)'}`,
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
          <h2 className="font-medium">Background Settings</h2>
        </div>
        <button
          aria-label={isOpen ? "Collapse panel" : "Expand panel"}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
        >
          {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      <div className="p-4 overflow-y-auto max-h-[calc(80vh-48px)]">
        <div className="w-full">
          <div className="flex flex-col rounded-lg justify-center gap-2 p-2" style={{ backgroundColor: `${textColor}10` }}>
            <span className="font-semibold custom-text-color">Background Image {bgType === "image" ? "On" : "Off"}</span>
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
          {/* <div className="text-xs mt-2 custom-text-color">
            {bgType === "image"
              ? "Background image is enabled."
              : "Background color is enabled."}
          </div> */}
        </div>
      </div>
    </div>
  )
};

export default BackgroundSettings;