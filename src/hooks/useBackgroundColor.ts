import { useState, useEffect } from "react";
import useSystemTheme from "./useSystemTheme";
import {
  DARK_BACKGROUND_COLOR_STORAGE_KEY,
  LIGHT_BACKGROUND_COLOR_STORAGE_KEY,
  storeDarkBackgroundColor,
  storeLightBackgroundColor,
} from "../utils/chromeStorage";

const useBackgroundColor = () => {
  const systemTheme = useSystemTheme();
  const [backgroundColor, setBackgroundColor] = useState<string>("#3c3c3c");

  const updateBackgroundColor = (color: string) => {
    setBackgroundColor(color);
    storeBackgroundColorInCorrespondingSystemThemeStorage(color);
  };

  const storeBackgroundColorInCorrespondingSystemThemeStorage = (
    color: string
  ) => {
    if (systemTheme === "dark") {
      storeDarkBackgroundColor(color);
    } else {
      storeLightBackgroundColor(color);
    }
  };

  useEffect(() => {
    chrome.storage.local.get(
      [DARK_BACKGROUND_COLOR_STORAGE_KEY, LIGHT_BACKGROUND_COLOR_STORAGE_KEY],
      (result) => {
        if (systemTheme === "dark") {
          setBackgroundColor(result.darkBackgroundColor ?? "#3c3c3c");
        } else {
          setBackgroundColor(result.lightBackgroundColor ?? "#dde3e9");
        }
      }
    );
  }, [systemTheme]);

  return {
    backgroundColor,
    updateBackgroundColor,
  };
};

export default useBackgroundColor;
