import { parse } from "tldts";

// export function getDomain(url: string) {
//   try {
//     return new URL(url).hostname;
//   } catch {
//     return "";
//   }

export function getDomain(url: string): string | null {
  return parse(url).domain;
}

export function faviconURL(u: string, size: string) {
  const domain = getDomain(u);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

export function faviconURLFromChrome(u: string, size: string) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", size);
  return url.toString();
}

export function getImageUrl(width: number): string {
  if (width < 640) {
    // Mobile
    return "https://picsum.photos/640/960";
  } else if (width < 1024) {
    // Tablet
    return "https://picsum.photos/1024/768";
  } else if (width < 1920) {
    // Standard Desktop
    return "https://picsum.photos/1920/1080";
  } else if (width < 2560) {
    // Large Desktop / QHD
    return "https://picsum.photos/2560/1440";
  } else {
    // Very Large Monitor / 4K and above
    return "https://picsum.photos/3840/2160";
  }
}
