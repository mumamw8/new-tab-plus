import React, { useState } from "react";

function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function getFirstLetter(url: string) {
  const domain = getDomain(url);
  return domain ? domain[0].toUpperCase() : "?";
}

const FaviconOrLetter: React.FC<{ url: string; size?: number }> = ({ url, size = 20 }) => {
  const [error, setError] = useState(false);
  const domain = getDomain(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;

  return error ? (
    <span
      className="inline-flex items-center justify-center bg-gray-300 rounded-full font-bold text-gray-700 mb-2"
      style={{ width: size, height: size, fontSize: size * 0.7 }}
    >
      {getFirstLetter(url)}
    </span>
  ) : (
    <img
      src={faviconUrl}
      alt="favicon"
      width={size}
      height={size}
      className="rounded mb-2 align-middle"
      onError={() => setError(true)}
    />
  );
};

export default FaviconOrLetter; 