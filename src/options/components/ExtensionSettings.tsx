import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext';
import { ChevronDown, ChevronUp, SettingsIcon } from 'lucide-react';
import VisibilitySettings from './VisiblitySettings';

export type VisibilitySettingsType = {
  readingList: boolean;
  suggestionsList: boolean;
}
export type RootNodesVisibilitySettingsType = {
  [nodeId: string]: boolean;
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
          <h2 className="font-medium">Content Settings</h2>
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

