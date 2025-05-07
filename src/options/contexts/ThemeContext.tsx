/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateTextColor } from '../utils/colorUtils';
import useSystemTheme from '../../hooks/useSystemTheme';

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
  const systemTheme = useSystemTheme();

  const handleSaveBackgroundColorAccordingToSystemTheme = () => {
    if (systemTheme === 'dark') {
      chrome.storage.local.set({ color: backgroundColor, darkBackgroundColor: backgroundColor });
      console.log("Dark background color saved to storage:", backgroundColor);
    } else {
      chrome.storage.local.set({ color: backgroundColor, lightBackgroundColor: backgroundColor });
      console.log("Light background color saved to storage:", backgroundColor);
    }
  }

  const handleSaveTextColorAccordingToSystemTheme = () => {
    if (systemTheme === 'dark') {
      chrome.storage.local.set({ darkTextColor: textColor });
      console.log("Dark text color set to:", textColor);
    } else {
      chrome.storage.local.set({ lightTextColor: textColor });
      console.log("Light text color set to:", textColor);
    }
  }
  // Load all relevant values from chrome.storage.local on mount
  useEffect(() => {
    chrome.storage.local.get(['bgType', 'isAutoTextColor', 'darkBackgroundColor', 'lightBackgroundColor', 'darkTextColor', 'lightTextColor'], (result) => {
      console.log("GET Settings result:", result);
      // Set background color if available
      if (result.bgType === 'color') {
        if (systemTheme === 'dark') {
          if (result.darkBackgroundColor) {
            setBackgroundColorState(result.darkBackgroundColor);
          }
        } else {
          if (result.lightBackgroundColor) {
            setBackgroundColorState(result.lightBackgroundColor);
          }
        }
      }

      const handleSetAutoTextColor = () => {
        const colorToCalculateTextColor = systemTheme === 'dark' ? result.darkBackgroundColor : result.lightBackgroundColor;
        const fallBackColorToCalculateTextColor = systemTheme === 'dark' ? '#3c3c3c' : '#dde3e9';
        setTextColor(calculateTextColor(colorToCalculateTextColor || fallBackColorToCalculateTextColor));
        setIsAutoTextColor(true);
      }


      // Set auto/manual text color mode
      if (typeof result.isAutoTextColor === 'boolean') {
        setIsAutoTextColor(result.isAutoTextColor);

        // Set text color based on mode
        if (result.isAutoTextColor) {
          handleSetAutoTextColor();
        } else if (result.darkTextColor || result.lightTextColor) {
          const textColorToSet = systemTheme === 'dark' ? result.darkTextColor : result.lightTextColor;
          if (!textColorToSet) {
            handleSetAutoTextColor();
          } else {
            setTextColor(textColorToSet);
          }
        }
      } else {
        // Default: auto mode
        handleSetAutoTextColor();
      }
      setIsInitialized(true);
    });
  }, [systemTheme]);

  // Only run this effect after initialization
  useEffect(() => {
    if (!isInitialized) return;
    if (isAutoTextColor) {
      console.log("BG Color being calculated for text color:", backgroundColor);
      setTextColor(calculateTextColor(backgroundColor));
    } else {
      // Load manual text color from storage if in manual mode
      chrome.storage.local.get(['darkTextColor', 'lightTextColor'], (result) => {
        if (systemTheme === 'dark' && result.darkTextColor) {
          setTextColor(result.darkTextColor);
        } else if (systemTheme === 'light' && result.lightTextColor) {
          setTextColor(result.lightTextColor);
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
    handleSaveBackgroundColorAccordingToSystemTheme();
    handleSaveTextColorAccordingToSystemTheme();
    console.log("SET Settings:", { color: backgroundColor, textColor: textColor });

  }, [backgroundColor, colorHistory, textColor, isInitialized, systemTheme]);

  const setBackgroundColor = (color: string) => {
    setBackgroundColorState(color);
  };

  const setManualTextColor = (color: string) => {
    setTextColor(color);
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