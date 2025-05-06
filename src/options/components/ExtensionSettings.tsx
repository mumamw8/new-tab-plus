import React, { useEffect, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, ChevronUp, SettingsIcon } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

export type VisibilitySettings = {
  readingList: boolean;
  suggestionsList: boolean;
}

const ExtensionSettings: React.FC = () => {
  const { textColor } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

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
          <SettingsIcon className="w-4 h-4" />
          <h2 className="font-medium">Extension Settings</h2>
        </div>
        <button
          aria-label={isOpen ? "Collapse panel" : "Expand panel"}
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"
        >
          {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      <div className="p-4 overflow-y-auto max-h-[calc(80vh-48px)]">
        <VisibilitySettings />
      </div>
    </div>
  )
}

export default ExtensionSettings;

const VisibilitySettings: React.FC = () => {
  const { textColor } = useTheme();
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    readingList: true,
    suggestionsList: true
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const toggleVisibility = (section: keyof VisibilitySettings) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    // Get or Initialize Visibility Settings
    chrome.storage.local.get(["visibilitySettings"], (result) => {
      if (result.visibilitySettings) {
        setVisibilitySettings(result.visibilitySettings);
        console.log("Visibility settings set to in ExtensionOptions:", result.visibilitySettings);
        setIsInitialized(true);
      } else {
        chrome.storage.local.set(
          { visibilitySettings: { readingList: true, suggestionsList: true } }
        );
        setIsInitialized(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isInitialized) {
      chrome.storage.local.set({ visibilitySettings: visibilitySettings });
    }
  }, [visibilitySettings, isInitialized]);

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="w-full" style={{ color: textColor }}>
      <h3 className="text-sm font-medium mb-3">Content Visibility</h3>
      <div className="space-y-3">
        {/* Suggestions List Button */}
        <button
          onClick={() => toggleVisibility('suggestionsList')}
          className="w-full cursor-pointer flex items-center justify-between p-2 rounded-lg transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10"
          style={{ backgroundColor: `${textColor}10` }}
        >
          <span>Suggestions List</span>
          {visibilitySettings.suggestionsList ? (
            <Eye size={18} />
          ) : (
            <EyeOff size={18} />
          )}
        </button>

        {/* Reading List Button */}
        <button
          onClick={() => toggleVisibility('readingList')}
          className="w-full cursor-pointer flex items-center justify-between p-2 rounded-lg transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10"
          style={{ backgroundColor: `${textColor}10` }}
        >
          <span>Reading List</span>
          {visibilitySettings.readingList ? (
            <Eye size={18} />
          ) : (
            <EyeOff size={18} />
          )}
        </button>
      </div>
    </div>
  );
};