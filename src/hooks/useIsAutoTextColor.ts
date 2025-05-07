import { useEffect, useState } from "react";
import {
  IS_AUTO_TEXT_COLOR_STORAGE_KEY,
  storeIsAutoTextColor,
} from "../utils/chromeStorage";

function useIsAutoTextColor() {
  const [isAutoTextColor, setIsAutoTextColor] = useState<boolean>(true);

  const toggleIsAutoTextColor = () => {
    const newIsAutoTextColor = !isAutoTextColor;
    storeIsAutoTextColor(newIsAutoTextColor);
    setIsAutoTextColor(newIsAutoTextColor);
  };

  useEffect(() => {
    chrome.storage.local.get(IS_AUTO_TEXT_COLOR_STORAGE_KEY, (result) => {
      if (typeof result.isAutoTextColor === "boolean") {
        setIsAutoTextColor(result.isAutoTextColor);
      }
    });
  }, []);

  return { isAutoTextColor, toggleIsAutoTextColor };
}

export default useIsAutoTextColor;
