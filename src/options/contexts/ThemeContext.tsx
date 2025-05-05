import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateTextColor } from '../utils/colorUtils';

type ThemeContextType = {
  backgroundColor: string;
  textColor: string;
  setBackgroundColor: (color: string) => void;
  colorHistory: string[];
  clearHistory: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default
  // const [backgroundColor, setBackgroundColorState] = useState<string>(() => {
  //   const savedColor = localStorage.getItem('themeBackgroundColor');
  //   return savedColor || '#f3f4f6'; // Default light gray
  // });
  // Initialize from storage
  const [backgroundColor, setBackgroundColorState] = useState<string>(() => {
    let savedColor = '#f3f4f6'; // Default light gray
    chrome.storage.local.get(["bgType", "color"], (result) => {
      if (result.bgType === "color") {
        savedColor = result.color;
        console.log("Background color set to in ThemeContext:", savedColor);
      }
    });
    return savedColor;
  });
  
  const [textColor, setTextColor] = useState<string>(() => {
    return calculateTextColor(backgroundColor);
  });
  
  const [colorHistory, setColorHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('colorHistory');
    return savedHistory ? JSON.parse(savedHistory).slice(0, 10) : [];
  });

  // Update text color when background changes and set background color in storage
  useEffect(() => {
    setTextColor(calculateTextColor(backgroundColor));
    // Save to localStorage
    localStorage.setItem('themeBackgroundColor', backgroundColor);
    
    // Update history without duplicates
    if (!colorHistory.includes(backgroundColor)) {
      const newHistory = [backgroundColor, ...colorHistory].slice(0, 10);
      setColorHistory(newHistory);
      localStorage.setItem('colorHistory', JSON.stringify(newHistory));
    }

    // Save to storage
    chrome.storage.local.set({ bgType: "color", color: backgroundColor });
    chrome.storage.local.set({ textColor: textColor });
    console.log("Text color set to in ThemeContext:", textColor);
    console.log("Background color set to in ThemeContext:", backgroundColor);
  }, [backgroundColor, colorHistory, textColor]);

  const setBackgroundColor = (color: string) => {
    setBackgroundColorState(color);
  };

  const clearHistory = () => {
    setColorHistory([]);
    localStorage.removeItem('colorHistory');
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        backgroundColor, 
        textColor, 
        setBackgroundColor,
        colorHistory,
        clearHistory
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};