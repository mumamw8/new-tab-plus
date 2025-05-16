// Theme preloader to apply theme before React initialization
const THEME_STORAGE_KEY_LOCAL = "appThemeLocal";

interface ThemeData {
  text: {
    color: string;
    isAuto: boolean;
  };
  background: {
    type: "color" | "wallpaper";
    color: string;
    wallpaper?: string;
  };
  cardStyle: "light" | "dark" | "neutral";
}

interface AppTheme {
  light: ThemeData;
  dark: ThemeData;
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

// Get initial theme synchronously
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

// Get system theme synchronously
const getInitialSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Apply theme styles synchronously
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
    document.body.classList.remove("custom-wallpaper-background-color-class");
  } else if (
    theme.background.type === "wallpaper" &&
    theme.background.wallpaper
  ) {
    document.documentElement.style.setProperty(
      "--custom-background-image",
      `url(/wallpapers/${theme.background.wallpaper})`,
      "important"
    );
    document.documentElement.style.setProperty(
      "--custom-background-color",
      "transparent",
      "important"
    );
    document.body.classList.add("custom-wallpaper-background-color-class");
  }
};

// Apply initial theme synchronously
const initialTheme = getInitialTheme();
const initialSystemTheme = getInitialSystemTheme();
const initialCurrentTheme =
  initialSystemTheme === "dark" ? initialTheme.dark : initialTheme.light;
applyThemeStyles(initialCurrentTheme);

export {};
