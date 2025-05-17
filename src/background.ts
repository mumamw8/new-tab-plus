chrome.runtime.onInstalled.addListener(() => {
  // console.log("Chrome Wallpaper Extension installed");
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  // console.log("Received message", sender);
  if (request.action === "updateReadingListItem") {
    // console.log("Updating reading list item", request.item.url);
    chrome.readingList.updateEntry({
      url: request.item.url,
      hasBeenRead: true,
    });
    sendResponse({ success: true });
  }

  // Always return true for asynchronous response
  return true;
});
