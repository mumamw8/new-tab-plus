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
