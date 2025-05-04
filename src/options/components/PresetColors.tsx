import React, { useState, useRef } from 'react';
import { Moon, Sun, Copy, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { hexToRgb } from '../utils/colorUtils';

const ColorPicker: React.FC = () => {
  const { backgroundColor, textColor, setBackgroundColor } = useTheme();
  const [format, setFormat] = useState<'hex' | 'rgb'>('hex');
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
  };
  
  const handleColorClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };
  
  const toggleColorFormat = () => {
    setFormat(prev => prev === 'hex' ? 'rgb' : 'hex');
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    setBackgroundColor(isDarkMode ? '#f3f4f6' : '#121212');
  };
  
  const copyToClipboard = () => {
    const colorValue = format === 'hex' ? backgroundColor : hexToRgb(backgroundColor);
    navigator.clipboard.writeText(colorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const displayColor = format === 'hex' ? backgroundColor : hexToRgb(backgroundColor);
  
  return (
    <div 
      className="flex flex-col items-center p-6 rounded-xl"
      style={{ color: textColor, transition: 'color 0.3s ease' }}
    >
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Color Picker</h2>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition duration-300"
          style={{ color: textColor }}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="relative w-full mb-6">
        <div 
          className="w-full h-16 rounded-lg cursor-pointer flex items-center justify-center border border-black/10"
          style={{ 
            backgroundColor, 
            color: textColor,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}
          onClick={handleColorClick}
        >
          <span className="font-mono tracking-wide text-sm">
            {displayColor}
          </span>
          <input 
            ref={colorInputRef}
            type="color" 
            value={backgroundColor}
            onChange={handleColorChange}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            aria-label="Select color"
          />
        </div>
      </div>
      
      <div className="w-full flex justify-between items-center mb-4">
        <button 
          onClick={toggleColorFormat}
          className="px-3 py-1.5 text-sm rounded-md transition duration-300"
          style={{ 
            backgroundColor: `${format === 'hex' ? 'rgba(0,0,0,0.1)' : 'transparent'}`,
            color: textColor 
          }}
        >
          Toggle {format === 'hex' ? 'RGB' : 'HEX'}
        </button>
        
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition duration-300 hover:bg-black/10 dark:hover:bg-white/10"
          style={{ color: textColor }}
          aria-label={copied ? "Copied!" : "Copy color value"}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;