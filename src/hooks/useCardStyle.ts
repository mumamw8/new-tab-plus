import { useEffect, useState } from "react";

function useCardStyle() {
  const [cardStyle, setCardStyle] = useState<"light" | "dark" | "neutral">(
    "neutral"
  );

  useEffect(() => {
    chrome.storage.local.get(["cardStyle"], (result) => {
      if (result.cardStyle) {
        setCardStyle(result.cardStyle);
      }
    });
  }, []);

  return cardStyle;
}

export default useCardStyle;
