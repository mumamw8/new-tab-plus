import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import useColorHistory from '../../hooks/useColorHistory';

const darkPresetColorObjects = [
  { name: "Charcoal Gray", color: "#343d3f" },
  { name: "Graphite", color: "#3c3c3c" },
  { name: "Slate Blue", color: "#333c4d" },
  { name: "Smoky Gray", color: "#393b43" },
  { name: "Deep Teal", color: "#28403c" },
  { name: "Forest Shadow", color: "#313f2c" },
  { name: "Ash Green", color: "#373d35" },
  { name: "Olive Brown", color: "#423b1f" },
  { name: "Burnt Umber", color: "#503625" },
  { name: "Mocha", color: "#463831" },
  { name: "Crimson Charcoal", color: "#4f3439" },
  { name: "Wine Smoke", color: "#46383a" },
  { name: "Plum Shadow", color: "#493545" },
  { name: "Midnight Violet", color: "#3f384c" },
  { name: 'Shadow Plum', color: '#42384b'}
];

const lightPresetColorObjects = [
  // { name: "Lavender Blush", color: "#fef7ff" },
  // { name: "Soft Rose", color: "#fff8f9" },
  // { name: "Ivory Blush", color: "#fff8f7" },
  // { name: "Peach Cream", color: "#fff8f5" },
  // { name: "Light Apricot", color: "#fff9ee" },
  // { name: "Almond Milk", color: "#fbf9f6" },
  // { name: "Pale Mint", color: "#f9fbf1" },
  // { name: "Seafoam Mist", color: "#f4fbf8" },
  // { name: "Cloud White", color: "#faf9f9" },
  // { name: "Petal Pink", color: "#fcf8fa" },
  // { name: "Periwinkle Tint", color: "#f9f9fe" },
  { name: "Pure White", color: "#ffffff" }
];


const presets = [...darkPresetColorObjects, ...lightPresetColorObjects];

const PresetColors: React.FC = () => {
  const { backgroundColor, textColor, updateBackgroundColor } = useTheme();
  const { colorHistory, clearHistory } = useColorHistory();

  return (
    <div className="w-full" style={{ color: textColor }}>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Preset Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.color}
              onClick={() => updateBackgroundColor(preset.color)}
              className="w-full aspect-square rounded-md transition-transform hover:scale-105 relative"
              style={{ 
                backgroundColor: preset.color,
                border: backgroundColor === preset.color ? `2px solid ${textColor}` : '2px solid gray',
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
                onClick={() => updateBackgroundColor(color)}
                className="w-full aspect-square rounded-md transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: color,
                  border: backgroundColor === color ? `2px solid ${textColor}` : '2px solid gray',
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