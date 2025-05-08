/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import useSystemTheme from "../../hooks/useSystemTheme";

export interface Theme {
  text: {
    color: string;
    isAuto: boolean;
  };
  background: {
    type: "color" | "image";
    color: string | null;
    image: string | null;
    fallbackImage: string | null;
  };
}

interface ThemeContextType {
  theme: Theme | null;
  updateTheme: (newTheme: Theme) => Promise<void>;
  partialUpdateTheme: (updates: Partial<Theme>) => Promise<void>;
  readTheme: () => Theme | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

const THEME_STORAGE_KEY = "appTheme";

const defaultLightTheme: Theme = {
  text: {
    color: "#333333",
    isAuto: false,
  },
  background: {
    type: "color",
    color: "#f0f0f0",
    image: null,
    fallbackImage: null,
  },
};

const defaultDarkTheme: Theme = {
  text: {
    color: "#f0f0f0",
    isAuto: false,
  },
  background: {
    type: "color",
    color: "#1a1a1a",
    image: null,
    fallbackImage: null,
  },
};

const getStorageKey = (systemTheme: "light" | "dark") =>
  `${THEME_STORAGE_KEY}-${systemTheme}`;

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
  const systemTheme = useSystemTheme(); // 'light' | 'dark'
  const [theme, setTheme] = useState<Theme | null>(null);
  const storageKey = getStorageKey(systemTheme);

  // Initialize theme from storage or defaults
  const initializeTheme = async () => {
    try {
      const storedTheme = await getFromChromeStorage(storageKey);
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        const defaultTheme =
          systemTheme === "dark" ? defaultDarkTheme : defaultLightTheme;
        setTheme(defaultTheme);
        await setToChromeStorage(storageKey, defaultTheme);
      }
    } catch (error) {
      console.error("Error initializing theme:", error);
      setTheme(systemTheme === "dark" ? defaultDarkTheme : defaultLightTheme);
    }
  };

  useEffect(() => {
    initializeTheme();
  }, [systemTheme]);

  // Listen for changes to theme from other tabs
  useEffect(() => {
    const handleChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local" && changes[storageKey]?.newValue) {
        setTheme(changes[storageKey].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
  }, [storageKey]);

  const updateTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    await setToChromeStorage(storageKey, newTheme);
  };

  const partialUpdateTheme = async (updates: Partial<Theme>) => {
    const current = (await getFromChromeStorage(storageKey)) ?? {};
    const merged = {
      ...current,
      ...updates,
      text: {
        ...current.text,
        ...updates.text,
      },
      background: {
        ...current.background,
        ...updates.background,
      },
    } as Theme;

    setTheme(merged);
    await setToChromeStorage(storageKey, merged);
  };

  const readTheme = () => theme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        partialUpdateTheme,
        readTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
