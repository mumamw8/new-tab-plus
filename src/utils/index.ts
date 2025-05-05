export function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
