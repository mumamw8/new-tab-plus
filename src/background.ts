chrome.runtime.onInstalled.addListener(() => {
  console.log("Chrome Wallpaper Extension installed");
  // Set default background color if no color is set
  chrome.storage.local.get(["bgType", "color"], (result) => {
    if (!result.bgType) {
      chrome.storage.local
        .set({ bgType: "color", color: "#23232b" })
        .then((result) => {
          console.log(result);
          console.log("Default background color set");
        });
    }
  });
});

// Listen for messages from the popup
// chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
//   if (request.action === "setWallpaper") {
//     setWallpaper(request.imageUrl);
//     sendResponse({ success: true });
//   }

//   // Always return true for asynchronous response
//   return true;
// });

chrome.runtime.onStartup.addListener(() => {
  // Set default background color if no color is set
  chrome.storage.local.get(["bgType", "color"], (result) => {
    if (!result.bgType) {
      chrome.storage.local
        .set({ bgType: "color", color: "#23232b" })
        .then((result) => {
          console.log(result);
          console.log("Default background color set");
        });
    }
  });
});
