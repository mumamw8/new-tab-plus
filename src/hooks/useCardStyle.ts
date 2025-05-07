import { useEffect, useState } from "react";

function useCardStyle() {
  const [cardStyle, setCardStyle] = useState<"light" | "dark" | "neutral">(
    "neutral"
  );

  useEffect(() => {
    const updateCardStyle = () => {
      chrome.storage.local.get(["cardStyle"], (result) => {
        if (result.cardStyle) {
          setCardStyle(result.cardStyle);
        }
      });
    };

    updateCardStyle();

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.cardStyle) {
        setCardStyle(changes.cardStyle.newValue);
      }
    });

    return () => {
      chrome.storage.onChanged.removeListener(updateCardStyle);
    };
  }, []);

  return cardStyle;
}

export default useCardStyle;
