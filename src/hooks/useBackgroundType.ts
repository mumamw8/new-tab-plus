import { useState, useEffect } from "react";
import { BG_TYPE_STORAGE_KEY, storeBgType } from "../utils/chromeStorage";

export type BackgroundType = "image" | "color";

const useBackgroundType = () => {
  const [bgType, setBgType] = useState<BackgroundType>("color");

  const updateBgType = (bgType: BackgroundType) => {
    setBgType(bgType);
    storeBgType(bgType);
  };

  useEffect(() => {
    chrome.storage.local.get([BG_TYPE_STORAGE_KEY], (result) => {
      if (result.bgType === "image" || result.bgType === "color") {
        setBgType(result.bgType);
      }
    });
  }, []);

  return { bgType, updateBgType };
};

export default useBackgroundType;
