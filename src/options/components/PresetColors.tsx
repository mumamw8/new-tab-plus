import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const presets = [
  { name: 'Slate', color: '#64748b' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Yellow', color: '#eab308' },
  { name: 'Lime', color: '#84cc16' },
  { name: 'Green', color: '#22c55e' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Teal', color: '#14b8a6' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Sky', color: '#0ea5e9' },
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Fuchsia', color: '#d946ef' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Rose', color: '#f43f5e' },
];

const PresetColors: React.FC = () => {
  const { backgroundColor, textColor, setBackgroundColor, colorHistory, clearHistory } = useTheme();
  
  return (
    <div className="w-full" style={{ color: textColor }}>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Preset Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.color}
              onClick={() => setBackgroundColor(preset.color)}
              className="w-full aspect-square rounded-md transition-transform hover:scale-105 relative"
              style={{ 
                backgroundColor: preset.color,
                border: backgroundColor === preset.color ? `2px solid ${textColor}` : '2px solid transparent',
                transform: backgroundColor === preset.color ? 'scale(1.05)' : 'scale(1)',
              }}
              aria-label={`Set color to ${preset.name}`}
              title={preset.name}
            >
              {backgroundColor === preset.color && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: textColor }}></span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {colorHistory.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Recent Colors</h3>
            <button 
              onClick={clearHistory}
              className="text-xs px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition"
              style={{ color: textColor }}
            >
              Clear
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {colorHistory.map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className="w-full aspect-square rounded-md transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: color,
                  border: backgroundColor === color ? `2px solid ${textColor}` : '2px solid transparent',
                  transform: backgroundColor === color ? 'scale(1.05)' : 'scale(1)',
                }}
                aria-label={`Set color to ${color}`}
                title={color}
              >
                {backgroundColor === color && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: textColor }}></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetColors;