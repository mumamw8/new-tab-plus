import React, { useEffect, useState } from "react";
import { faviconURL, faviconURLFromChrome, getDomain } from "../utils";
import useCardStyle from "../hooks/useCardStyle";
import clsx from "clsx";

function getFirstLetter(url: string) {
  const domain = getDomain(url);
  return domain ? domain[0].toUpperCase() : "?";
}

const FaviconOrLetter: React.FC<{ title: string; url: string; iconSize: number }> = ({ title, url, iconSize = 32 }) => {
  const [error, setError] = useState(false);
  const [src, setSrc] = useState<string | null | undefined>(undefined);
  const itemSize = iconSize < 32 ? iconSize : 32;
  const cardStyle = useCardStyle();

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      if (img.naturalHeight === 16 && img.naturalWidth === 16) {
        setSrc(null);
      } else {
        setSrc(faviconURL(url, iconSize.toString()));
      }
    };

    img.onerror = () => {
      setSrc(null);
    };

    img.src = faviconURL(url, iconSize.toString());
  }, [url, iconSize]);

  if (src === undefined) {
    return null;
  }

  return <div 
    className={clsx(
      `relative flex items-center justify-center w-16 h-16 mb-2 rounded-2xl backdrop-blur-sm shadow-md transition-all duration-200 overflow-hidden`,
      cardStyle === 'neutral' && 'bg-white/5',
      cardStyle === 'light' && 'bg-white/20',
      cardStyle === 'dark' && 'bg-gray-900/20'
    )}
  >
    {error ? (
      <span
        className="inline-flex items-center justify-center bg-gray-300 rounded-full font-bold text-gray-700 mb-2"
        style={{ width: itemSize, height: itemSize, fontSize: itemSize * 0.7 }}
      >
        {getFirstLetter(url)}
      </span>
    ) : (
      <img
        src={src ?? faviconURLFromChrome(url, iconSize.toString())}
        alt={`${title} favicon`}
        width={itemSize}
        height={itemSize}
        className="object-contain rounded-lg"
        onError={() => setError(true)}
      />
    )}
  </div>
};

export default FaviconOrLetter; 