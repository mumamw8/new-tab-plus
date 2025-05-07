import { useState, useEffect } from "react";
import useSystemTheme from "./useSystemTheme";
import { calculateTextColor } from "../options/utils/colorUtils";
import useBackgroundColor from "./useBackgroundColor";
import {
  DARK_BACKGROUND_COLOR_STORAGE_KEY,
  LIGHT_BACKGROUND_COLOR_STORAGE_KEY,
  DARK_TEXT_COLOR_STORAGE_KEY,
  LIGHT_TEXT_COLOR_STORAGE_KEY,
  IS_AUTO_TEXT_COLOR_STORAGE_KEY,
  storeDarkTextColor,
  storeLightTextColor,
} from "../utils/chromeStorage";
import useIsAutoTextColor from "./useIsAutoTextColor";

const useTextColor = () => {
  const systemTheme = useSystemTheme();
  const { backgroundColor } = useBackgroundColor();
  const { isAutoTextColor } = useIsAutoTextColor();
  const [textColor, setTextColor] = useState<string>("#ffffff");

  const updateTextColor = (color: string) => {
    setTextColor(color);
    storeTextColorInCorrespondingSystemThemeStorage(color);
  };

  const storeTextColorInCorrespondingSystemThemeStorage = (color: string) => {
    if (systemTheme === "dark") {
      storeDarkTextColor(color);
    } else {
      storeLightTextColor(color);
    }
  };
  const handleBackgroundColorChange = (color: string) => {
    const newTextColor = calculateTextColor(color);
    chrome.storage.local.get(IS_AUTO_TEXT_COLOR_STORAGE_KEY, (result) => {
      if (result.isAutoTextColor) {
        updateTextColor(newTextColor);
      }
    });
  };

  useEffect(() => {
    chrome.storage.local.get(
      [DARK_TEXT_COLOR_STORAGE_KEY, LIGHT_TEXT_COLOR_STORAGE_KEY],
      (result) => {
        if (systemTheme === "dark") {
          setTextColor(result.darkTextColor ?? "#ffffff");
        } else {
          setTextColor(result.lightTextColor ?? "#151516");
        }
      }
    );
  }, [systemTheme]);

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes) => {
      if (
        changes[IS_AUTO_TEXT_COLOR_STORAGE_KEY] &&
        changes[IS_AUTO_TEXT_COLOR_STORAGE_KEY].newValue === true
      ) {
        handleBackgroundColorChange(backgroundColor);
      }
      if (changes[DARK_BACKGROUND_COLOR_STORAGE_KEY] && isAutoTextColor) {
        handleBackgroundColorChange(
          changes[DARK_BACKGROUND_COLOR_STORAGE_KEY].newValue
        );
      }
      if (changes[LIGHT_BACKGROUND_COLOR_STORAGE_KEY] && isAutoTextColor) {
        handleBackgroundColorChange(
          changes[LIGHT_BACKGROUND_COLOR_STORAGE_KEY].newValue
        );
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(() => {});
    };
  }, []);

  return { textColor, updateTextColor };
};

export default useTextColor;
