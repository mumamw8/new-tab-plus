import { useEffect, useState } from "react";
import { CardStyle, storeCardStyle } from "../utils/chromeStorage";

function useCardStyle() {
  const [cardStyle, setCardStyle] = useState<CardStyle>("neutral");

  const updateCardStyle = (cardStyle: CardStyle) => {
    storeCardStyle(cardStyle);
    setCardStyle(cardStyle);
  };

  useEffect(() => {
    const initCardStyle = () => {
      chrome.storage.local.get(["cardStyle"], (result) => {
        if (result.cardStyle) {
          setCardStyle(result.cardStyle);
        }
      });
    };

    initCardStyle();
    // chrome.storage.onChanged.addListener((changes) => {
    //   if (changes.cardStyle) {
    //     setCardStyle(changes.cardStyle.newValue);
    //   }
    // });

    // return () => {
    //   chrome.storage.onChanged.removeListener(initCardStyle);
    // };
  }, []);

  return { cardStyle, updateCardStyle };
}

export default useCardStyle;
