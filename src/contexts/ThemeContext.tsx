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
import { getImageUrl } from "../utils";

// Single storage key for the entire theme
const THEME_STORAGE_KEY = "appTheme";

export type BackgroundType = "image" | "color";
export type CardStyle = "light" | "dark" | "neutral";

export interface ThemeData {
  text: {
    color: string;
    isAuto: boolean;
  };
  background: {
    type: BackgroundType;
    color: string;
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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Detect system theme
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [appTheme, setAppTheme] = useState<AppTheme>(defaultAppTheme);
  const [currentTheme, setCurrentTheme] =
    useState<ThemeData>(defaultLightTheme);

  // Initialize system theme
  useEffect(() => {
    const getSystemTheme = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

    setSystemTheme(getSystemTheme());

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
        } else {
          // If no theme is stored, use default and save it
          await setToChromeStorage(THEME_STORAGE_KEY, defaultAppTheme);
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
    setCurrentTheme(systemTheme === "dark" ? appTheme.dark : appTheme.light);
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
        "custom-light-transparent-background-color-class"
      );
    } else if (currentTheme.background.type === "image") {
      // Handle background image
      const imageUrl = getImageUrl(window.innerWidth);
      document.body.style.setProperty(
        "--custom-background-image",
        `url(${imageUrl})`,
        "important"
      );

      // Add appropriate overlay class
      document.body.classList.remove(
        "custom-dark-transparent-background-color-class",
        "custom-light-transparent-background-color-class"
      );
      if (systemTheme === "dark") {
        document.body.classList.add(
          "custom-dark-transparent-background-color-class"
        );
      } else {
        document.body.classList.add(
          "custom-light-transparent-background-color-class"
        );
      }

      // If text color is auto and background is image, set text color based on systemTheme
      if (currentTheme.text.isAuto) {
        const newTextColor = systemTheme === "dark" ? "#ffffff" : "#151516";

        // Only update if the color is different to avoid infinite loop
        if (currentTheme.text.color !== newTextColor) {
          updateTheme({
            text: {
              ...currentTheme.text,
              color: newTextColor,
            },
          });
        }
      }
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

    // Auto-update text color if enabled and background color changed
    if (updates.background?.color && currentTheme.text.isAuto) {
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
