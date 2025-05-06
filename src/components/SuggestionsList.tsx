import React, { useEffect, useState } from "react";
import { faviconURL, faviconURLFromChrome } from "../utils";

function sortHistoryItemsByTypedCount(historyItems: chrome.history.HistoryItem[]): chrome.history.HistoryItem[] {
  // Filter out items with no typedCount or typedCount of 0
  const filteredItems = historyItems.filter(item => 
    item.typedCount !== undefined && item.typedCount > 0
  );

  return [...filteredItems].sort((a, b) => {
    // Handle undefined typedCount values
    const aCount = a.typedCount ?? 0;
    const bCount = b.typedCount ?? 0;
    
    // Sort in descending order (higher typedCount values first)
    return bCount - aCount;
  });
}

const SuggestionsList: React.FC = () => {
  const [history, setHistory] = useState<chrome.history.HistoryItem[]>([]);

  useEffect(() => {
    // To look for history items visited in the last week,
    // subtract a week of milliseconds from the current time.
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const oneWeekAgo = new Date().getTime() - millisecondsPerWeek;

    chrome.history.search({ text: "", startTime: oneWeekAgo }, (historyItems) => {
      // Get the top 10 history items by typedCount
      const sortedHistory = sortHistoryItemsByTypedCount(historyItems);
      setHistory(sortedHistory.slice(0, 10));
    });
  }, []);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold custom-text-color">Suggestions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {history.map((item, idx) => (
          <a
            href={item.url}
            title={item.title}
            aria-label={item.title}
            key={idx}
            className="relative flex custom-text-color bg-white/5 backdrop-blur-sm rounded-xl shadow-md p-4 items-center gap-4"
          >
            {item.url && <Favicon url={item.url} iconSize="32" size={16} />}
            <span className="custom-text-color text-[0.9rem] font-semibold truncate w-full">{item.title && item.title.length > 0 ? item.title : item.url}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default SuggestionsList;

function Favicon({ url, size, iconSize }: { url: string, iconSize: string, size: number }) {
  const [src, setSrc] = useState<string | null | undefined>(undefined);

  // useEffect to check if the favicon returned by the google api is a custom favicon or a default favicon
  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      if (img.naturalHeight === 16 && img.naturalWidth === 16) {
        setSrc(null);
      } else {
        setSrc(faviconURL(url, iconSize));
      }
    };

    img.onerror = () => {
      setSrc(null);
    };

    img.src = faviconURL(url, iconSize);
  }, [url, iconSize]);

  if (src === undefined) {
    return null;
  }

  return <img 
    src={src ?? faviconURLFromChrome(url, iconSize)}
    alt={`${url} favicon`}
    width={size}
    height={size}
    className="object-contain rounded-lg"
  />;
}