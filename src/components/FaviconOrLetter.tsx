import React, { useState } from "react";
import { getDomain } from "../utils";

function getFirstLetter(url: string) {
  const domain = getDomain(url);
  return domain ? domain[0].toUpperCase() : "?";
}

// function faviconURL(u: string, size: string) {
//   const url = new URL(chrome.runtime.getURL("/_favicon/"));
//   url.searchParams.set("pageUrl", u);
//   url.searchParams.set("size", size);
//   return url.toString();
// }
function faviconURL(u: string, size: string) {
  const domain = getDomain(u);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
}

const FaviconOrLetter: React.FC<{ title: string; url: string; size?: number }> = ({ title, url, size = 32 }) => {
  const [error, setError] = useState(false);
  const itemSize = 32;

  return <div 
    className={`relative flex items-center justify-center w-16 h-16 mb-2 rounded-2xl bg-white/5 backdrop-blur-sm shadow-md transition-all duration-200 overflow-hidden`}
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
        src={faviconURL(url, size.toString())}
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