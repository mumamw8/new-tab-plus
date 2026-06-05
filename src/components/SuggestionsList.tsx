import React, { useEffect, useState } from "react";
import { faviconURL, faviconURLFromChrome, getDomain } from "../utils";
import clsx from "clsx";
import useCardStyle from "../hooks/useCardStyle";

function filterHistoryItems(historyItems: chrome.history.HistoryItem[]): chrome.history.HistoryItem[] {
  return historyItems.filter(item =>
    item.url && !item.url.toLowerCase().startsWith('chrome') &&
    ((item.typedCount !== undefined && item.typedCount > 0) ||
    (item.visitCount !== undefined && item.visitCount > 0))
  );
}

function getHistoryScore(item: chrome.history.HistoryItem): number {
  return (item.typedCount ?? 0) + (item.visitCount ?? 0);
}

function dedupeHistoryByDomain(historyItems: chrome.history.HistoryItem[]): chrome.history.HistoryItem[] {
  const domainMap = new Map<string, { item: chrome.history.HistoryItem; totalScore: number }>();

  for (const item of historyItems) {
    if (!item.url) continue;
    const domain = getDomain(item.url);
    if (!domain) continue;

    const score = getHistoryScore(item);
    const existing = domainMap.get(domain);

    if (!existing) {
      domainMap.set(domain, { item, totalScore: score });
    } else {
      existing.totalScore += score;
      if (score > getHistoryScore(existing.item)) {
        existing.item = item;
      }
    }
  }

  return [...domainMap.values()]
    .sort((a, b) => b.totalScore - a.totalScore)
    .map(({ item }) => item);
}

const SuggestionsList: React.FC = () => {
  const [history, setHistory] = useState<chrome.history.HistoryItem[]>([]);
  const { cardStyle } = useCardStyle();

  useEffect(() => {
    // To look for history items visited in the last week,
    // subtract a week of milliseconds from the current time.
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const oneWeekAgo = new Date().getTime() - millisecondsPerWeek;

    chrome.history.search({ text: "", startTime: oneWeekAgo }, (historyItems) => {
      const filteredHistory = filterHistoryItems(historyItems);
      const uniqueByDomain = dedupeHistoryByDomain(filteredHistory);
      setHistory(uniqueByDomain.slice(0, 10));
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
            key={item.url ?? idx}
            className={clsx(
              "relative flex custom-text-color backdrop-blur-sm rounded-xl shadow-[0_0_6px_rgb(0_0_0/0.1)] p-4 items-center gap-4",
              cardStyle === 'neutral' && 'bg-white/5',
              cardStyle === 'light' && 'bg-white/20',
              cardStyle === 'dark' && 'bg-gray-900/20'
            )}
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