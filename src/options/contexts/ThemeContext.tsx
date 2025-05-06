import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateTextColor } from '../utils/colorUtils';

type ThemeContextType = {
  backgroundColor: string;
  textColor: string;
  setBackgroundColor: (color: string) => void;
  colorHistory: string[];
  clearHistory: () => void;
  isAutoTextColor: boolean;
  setIsAutoTextColor: (value: boolean) => void;
  setManualTextColor: (color: string) => void;
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
  // Default values
  const [backgroundColor, setBackgroundColorState] = useState<string>('#3c3c3c');
  const [isAutoTextColor, setIsAutoTextColor] = useState<boolean>(true);
  const [textColor, setTextColor] = useState<string>(() => calculateTextColor('#3c3c3c'));
  const [colorHistory, setColorHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('colorHistory');
    return savedHistory ? JSON.parse(savedHistory).slice(0, 10) : [];
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load all relevant values from chrome.storage.local on mount
  useEffect(() => {
    chrome.storage.local.get(['bgType', 'color', 'isAutoTextColor', 'textColor'], (result) => {
      console.log("GET Settings result:", result);
      // Set background color if available
      if (result.bgType === 'color' && result.color) {
        setBackgroundColorState(result.color);
      }

      // Set auto/manual text color mode
      if (typeof result.isAutoTextColor === 'boolean') {
        setIsAutoTextColor(result.isAutoTextColor);

        // Set text color based on mode
        if (result.isAutoTextColor) {
          setTextColor(calculateTextColor(result.color || '#3c3c3c'));
        } else if (result.textColor) {
          console.log("SET Text Color:", result.textColor);
          setTextColor(result.textColor);
        }
      } else {
        // Default: auto mode
        setIsAutoTextColor(true);
        setTextColor(calculateTextColor(result.color || '#3c3c3c'));
      }
      setIsInitialized(true);
    });
  }, []);

  // Only run this effect after initialization
  useEffect(() => {
    if (!isInitialized) return;
    if (isAutoTextColor) {
      setTextColor(calculateTextColor(backgroundColor));
    } else {
      // Load manual text color from storage if in manual mode
      chrome.storage.local.get('textColor', (result) => {
        if (result.textColor) {
          setTextColor(result.textColor);
        }
      });
    }
  }, [backgroundColor, isAutoTextColor, isInitialized]);

  // Update storage and color history when background or text color changes
  useEffect(() => {
    if (!isInitialized) return;
    // Save to localStorage
    localStorage.setItem('themeBackgroundColor', backgroundColor);

    // Update history without duplicates
    if (!colorHistory.includes(backgroundColor)) {
      const newHistory = [backgroundColor, ...colorHistory].slice(0, 10);
      setColorHistory(newHistory);
      localStorage.setItem('colorHistory', JSON.stringify(newHistory));
    }

    // Save to chrome.storage
    chrome.storage.local.set({ color: backgroundColor });
    chrome.storage.local.set({ textColor: textColor });
    console.log("SET Settings:", { color: backgroundColor, textColor: textColor });
    // Optionally: chrome.storage.local.set({ isAutoTextColor });

    // Debug logs
    // console.log("Text color set to in ThemeContext:", textColor);
    // console.log("Background color set to in ThemeContext:", backgroundColor);
  }, [backgroundColor, colorHistory, textColor, isInitialized]);

  const setBackgroundColor = (color: string) => {
    setBackgroundColorState(color);
  };

  const setManualTextColor = (color: string) => {
    setTextColor(color);
    chrome.storage.local.set({ textColor: color });
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
        clearHistory,
        isAutoTextColor,
        setIsAutoTextColor,
        setManualTextColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};