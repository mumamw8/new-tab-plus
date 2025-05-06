import React, { useEffect, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react'; 
import { VisibilitySettingsType } from './ExtensionSettings';

const VisibilitySettings: React.FC = () => {
  const { textColor } = useTheme();
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettingsType>({
    readingList: true,
    suggestionsList: true
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const toggleVisibility = (section: keyof VisibilitySettingsType) => {
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

export default VisibilitySettings;