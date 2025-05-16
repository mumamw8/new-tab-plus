/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { calculateTextColor } from "../utils/colorUtils";

// Single storage key for the entire theme
const THEME_STORAGE_KEY = "appTheme";
const THEME_STORAGE_KEY_LOCAL = "appThemeLocal";

export type BackgroundType = "color" | "wallpaper";
export type CardStyle = "light" | "dark" | "neutral";

export interface ThemeData {
  text: {
    color: string;
    isAuto: boolean;
  };
  background: {
    type: BackgroundType;
    color: string;
    wallpaper?: string; // Path to selected wallpaper
  };
  cardStyle: CardStyle;
}

export interface AppTheme {
  light: ThemeData;
  dark: ThemeData;
}

interface ThemeContextType {
  theme: ThemeData;
  systemTheme: "light" | "dark";
  updateTheme: (newTheme: Partial<ThemeData>) => void;

  // Convenience methods that map to the old hooks
  textColor: string;
  backgroundColor: string;
  bgType: BackgroundType;
  cardStyle: CardStyle;
  isAutoTextColor: boolean;

  updateTextColor: (color: string) => void;
  updateBackgroundColor: (color: string) => void;
  updateBgType: (type: BackgroundType) => void;
  updateCardStyle: (style: CardStyle) => void;
  toggleIsAutoTextColor: () => void;
}

const defaultLightTheme: ThemeData = {
  text: {
    color: "#151516",
    isAuto: true,
  },
  background: {
    type: "color",
    color: "#dde3e9",
  },
  cardStyle: "neutral",
};

const defaultDarkTheme: ThemeData = {
  text: {
    color: "#ffffff",
    isAuto: true,
  },
  background: {
    type: "color",
    color: "#3c3c3c",
  },
  cardStyle: "neutral",
};

const defaultAppTheme: AppTheme = {
  light: defaultLightTheme,
  dark: defaultDarkTheme,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper functions for Chrome storage
const getFromChromeStorage = async (key: string): Promise<any | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key] ?? null);
    });
  });
};

const setToChromeStorage = async (key: string, value: any) => {
  return new Promise<void>((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => resolve());
  });
};

// Helper function to get initial theme synchronously
const getInitialTheme = (): AppTheme => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY_LOCAL);
    if (storedTheme) {
      return JSON.parse(storedTheme);
    }
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
  }
  return defaultAppTheme;
};

// Helper function to get system theme synchronously
const getInitialSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

// Helper function to apply theme styles synchronously
const applyThemeStyles = (theme: ThemeData) => {
  // Apply text color
  document.documentElement.style.setProperty(
    "--custom-text-color",
    `light-dark(${theme.text.color}, ${theme.text.color})`,
    "important"
  );

  // Apply background
  if (theme.background.type === "color") {
    document.documentElement.style.setProperty(
      "--custom-background-image",
      "none",
      "important"
    );
    document.documentElement.style.setProperty(
      "--custom-background-color",
      `light-dark(${theme.background.color}, ${theme.background.color})`,
      "important"
    );
  }
};

// Apply initial theme synchronously
const initialTheme = getInitialTheme();
const initialSystemTheme = getInitialSystemTheme();
const initialCurrentTheme = initialSystemTheme === "dark" ? initialTheme.dark : initialTheme.light;
applyThemeStyles(initialCurrentTheme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with synchronous values
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(initialSystemTheme);
  const [appTheme, setAppTheme] = useState<AppTheme>(initialTheme);
  const [currentTheme, setCurrentTheme] = useState<ThemeData>(initialCurrentTheme);

  // Initialize system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Initialize theme from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Load theme from storage
        const storedTheme = (await getFromChromeStorage(
          THEME_STORAGE_KEY
        )) as AppTheme | null;

        if (storedTheme) {
          setAppTheme(storedTheme);
          // Update localStorage as fallback
          localStorage.setItem(THEME_STORAGE_KEY_LOCAL, JSON.stringify(storedTheme));
        } else {
          // If no theme is stored, use default and save it
          await setToChromeStorage(THEME_STORAGE_KEY, defaultAppTheme);
          localStorage.setItem(THEME_STORAGE_KEY_LOCAL, JSON.stringify(defaultAppTheme));
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        // If there's an error, use default theme
        setAppTheme(defaultAppTheme);
      }
    };

    loadTheme();
  }, []);

  // Update current theme when system theme or app theme changes
  useEffect(() => {
    const newTheme = systemTheme === "dark" ? appTheme.dark : appTheme.light;
    setCurrentTheme(newTheme);
    applyThemeStyles(newTheme);
  }, [systemTheme, appTheme]);

  // Apply theme to document
  useEffect(() => {
    if (!currentTheme) return;

    // Apply text color
    document.body.style.setProperty(
      "--custom-text-color",
      `light-dark(${currentTheme.text.color}, ${currentTheme.text.color})`,
      "important"
    );

    // Apply background
    if (currentTheme.background.type === "color") {
      document.body.style.setProperty(
        "--custom-background-image",
        "none",
        "important"
      );
      document.body.style.setProperty(
        "--custom-background-color",
        `light-dark(${currentTheme.background.color}, ${currentTheme.background.color})`,
        "important"
      );

      // Remove any background image classes
      document.body.classList.remove(
        "custom-dark-transparent-background-color-class",
        "custom-light-transparent-background-color-class",
        "custom-wallpaper-background-color-class"
      );
    } else if (currentTheme.background.type === "wallpaper" && currentTheme.background.wallpaper) {
      document.body.style.setProperty(
        "--custom-background-image",
        `url(/wallpapers/${currentTheme.background.wallpaper})`,
        "important"
      );
      document.body.style.setProperty(
        "--custom-background-color",
        "transparent",
        "important"
      );
      document.body.classList.add("custom-wallpaper-background-color-class");
    }
  }, [currentTheme]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local") return;

      if (changes[THEME_STORAGE_KEY]) {
        setAppTheme(changes[THEME_STORAGE_KEY].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  // Update theme and storage
  const updateTheme = (updates: Partial<ThemeData>) => {
    // Create a new theme object with the updates
    const updatedTheme = { ...currentTheme, ...updates };

    // Update the appropriate theme in appTheme
    const newAppTheme = { ...appTheme };
    if (systemTheme === "dark") {
      newAppTheme.dark = updatedTheme;
    } else {
      newAppTheme.light = updatedTheme;
    }

    // Update state
    setAppTheme(newAppTheme);
    setCurrentTheme(updatedTheme);

    // Save to storage
    setToChromeStorage(THEME_STORAGE_KEY, newAppTheme);

    // First check if text color is explicitly updated
    if (updates.text?.color) {
      // If text color is explicitly updated, ensure it's applied
      const themeWithText = {
        ...updatedTheme,
        text: {
          ...updatedTheme.text,
          color: updates.text.color,
        },
      };

      // Update the appropriate theme in appTheme
      if (systemTheme === "dark") {
        newAppTheme.dark = themeWithText;
      } else {
        newAppTheme.light = themeWithText;
      }

      // Update state and storage
      setAppTheme(newAppTheme);
      setCurrentTheme(themeWithText);
      setToChromeStorage(THEME_STORAGE_KEY, newAppTheme);
    }
    // Then check for auto text color update if background color changed
    else if (updates.background?.color && currentTheme.text.isAuto) {
      const newTextColor = calculateTextColor(updates.background.color);

      // Update text color in the theme
      const themeWithAutoText = {
        ...updatedTheme,
        text: {
          ...updatedTheme.text,
          color: newTextColor,
        },
      };

      // Update the appropriate theme in appTheme
      if (systemTheme === "dark") {
        newAppTheme.dark = themeWithAutoText;
      } else {
        newAppTheme.light = themeWithAutoText;
      }

      // Update state and storage
      setAppTheme(newAppTheme);
      setCurrentTheme(themeWithAutoText);
      setToChromeStorage(THEME_STORAGE_KEY, newAppTheme);
    }
  };

  // Convenience methods that map to the old hooks
  const updateTextColor = (color: string) => {
    updateTheme({
      text: {
        ...currentTheme.text,
        color,
      },
    });
  };

  const updateBackgroundColor = (color: string) => {
    updateTheme({
      background: {
        ...currentTheme.background,
        color,
      },
    });
  };

  const updateBgType = (type: BackgroundType) => {
    updateTheme({
      background: {
        ...currentTheme.background,
        type,
      },
    });
  };

  const updateCardStyle = (style: CardStyle) => {
    updateTheme({
      cardStyle: style,
    });
  };

  const toggleIsAutoTextColor = () => {
    const newIsAuto = !currentTheme.text.isAuto;

    updateTheme({
      text: {
        ...currentTheme.text,
        isAuto: newIsAuto,
      },
    });

    // If turning on auto text color, update text color based on background
    if (newIsAuto) {
      const newTextColor = calculateTextColor(currentTheme.background.color);
      updateTheme({
        text: {
          color: newTextColor,
          isAuto: newIsAuto,
        },
      });
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        systemTheme,
        updateTheme,

        // Convenience properties and methods that map to the old hooks
        textColor: currentTheme.text.color,
        backgroundColor: currentTheme.background.color,
        bgType: currentTheme.background.type,
        cardStyle: currentTheme.cardStyle,
        isAutoTextColor: currentTheme.text.isAuto,

        updateTextColor,
        updateBackgroundColor,
        updateBgType,
        updateCardStyle,
        toggleIsAutoTextColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Helper function to get image URL
// function getImageUrl(windowWidth: number): string {
//   return windowWidth > 1920
//     ? "https://source.unsplash.com/random/3840x2160/?nature,water,mountain"
//     : windowWidth > 1280
//     ? "https://source.unsplash.com/random/1920x1080/?nature,water,mountain"
//     : "https://source.unsplash.com/random/1280x720/?nature,water,mountain";
// }
