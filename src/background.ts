chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Wallpaper Extension installed");
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "setWallpaper") {
    setWallpaper(request.imageUrl);
    sendResponse({ success: true });
  }

  // Always return true for asynchronous response
  return true;
});

// Function to set the wallpaper
function setWallpaper(imageUrl: string) {
  // For a URL from the extension, we need the full URL
  const fullUrl = chrome.runtime.getURL(imageUrl);
  console.log("Setting wallpaper to:", fullUrl);
}
