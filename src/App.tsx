import { useEffect, useState } from "react";
import "./App.css";
import BookmarkList from "./components/BookmarkList";
import { CircleChevronLeftIcon, EllipsisIcon } from "lucide-react";
import ReadingList from "./components/ReadingList";
import SuggestionsList from "./components/SuggestionsList";
import { RootNodesVisibilitySettingsType, VisibilitySettingsType } from "./options/components/ExtensionSettings";
import { calculateImageBrightness, getTextColorForBrightness } from "./options/utils/colorUtils";
import { getImageUrl } from "./utils";

function App() {
  const [currentNodes, setCurrentNodes] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [folderStack, setFolderStack] = useState<
    chrome.bookmarks.BookmarkTreeNode[][]
  >([]);
  const [titleStack, setTitleStack] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettingsType>({
    readingList: true,
    suggestionsList: true
  });
  const [rootNodesVisibilitySettings, setRootNodesVisibilitySettings] = useState<RootNodesVisibilitySettingsType>({});
  const [bookmarksVisibilitySettingsIsEmpty, setBookmarksVisibilitySettingsIsEmpty] = useState(true);

  useEffect(() => {
    chrome.bookmarks.getTree((bookMarkTreeNodes) => {
      if (!bookMarkTreeNodes || bookMarkTreeNodes.length === 0) return;
      const root = bookMarkTreeNodes[0];
      setCurrentNodes(root.children || []);
      setLoading(false);
    });
  }, []);

  // Example: usage with file input
  function handleGetImageBrightness(imageUrl: string): void {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = async () => {
      const brightness: number = calculateImageBrightness(img);
      const textColor: string = getTextColorForBrightness(brightness);
      console.log("Brightness:", brightness);
      console.log("Text color:", textColor);
      setTextColor(textColor);
      document.body.style.setProperty('--custom-text-color', textColor, 'important');
      // setTextColor(textColor);
    };

    img.onerror = () => {
      console.warn("Failed to load image:", imageUrl);
    };
  }

  // Set App Background
  useEffect(() => {
    // get background and text color from storage
    chrome.storage.local.get(["bgType", "color", "textColor"], (result) => {
      console.log("Stored Theme info...", result);
      const imageUrl = getImageUrl(window.innerWidth); // get image url based on window width for if image background is selected
      if (result.bgType === "color") {
        // document.body.style.backgroundColor = result.color;
        document.body.style.setProperty('--custom-background-color', result.color, 'important');
        console.log("Background color set to:", result.color);
        // set background image to none
        document.body.style.setProperty('--custom-background-image', 'none', 'important');
      } else if (result.bgType === "image") {
        // document.body.style.backgroundImage = `url(${result.image})`;
        // document.body.style.setProperty('--custom-background-image', `url(${result.image})`, 'important');
        // document.body.style.setProperty('--custom-background-image', `url(${'/background-15_x1032.jpg'})`, 'important');
        document.body.style.setProperty('--custom-background-image', `url(${imageUrl})`, 'important');
        console.log("Background image set to:", result.image);
      } else {
        // set background image to none
        document.body.style.setProperty('--custom-background-image', 'none', 'important');
        // document.body.style.backgroundColor = "black";
        document.body.style.setProperty('--custom-background-color', "#3c3c3c", 'important');
        chrome.storage.local.get(["bgType", "color"], (result) => {
          if (!result.bgType) {
            chrome.storage.local
              .set({ bgType: "color", color: "#3c3c3c" })
              .then((result) => {
                console.log(result);
                console.log("Default background color set");
              });
          }
        });
      }
      if (result.textColor && result.bgType === "color") {
        setTextColor(result.textColor);
        document.body.style.setProperty('--custom-text-color', result.textColor, 'important');
        console.log("Text color set to:", result.textColor);
      } else if (result.bgType === "image") {
        handleGetImageBrightness(imageUrl);
      } else {
        setTextColor("#ffffff");
        document.body.style.setProperty('--custom-text-color', "#ffffff", 'important');
        console.log("Text color set to:", "#ffffff");
      }
    });
  }, []);

  // Get Visibility Settings
  useEffect(() => {
    chrome.storage.local.get("visibilitySettings", (result) => {
      if (result.visibilitySettings) {
        setVisibilitySettings(result.visibilitySettings);
        // console.log("Visibility settings:", result.visibilitySettings);
      }
    });
  }, []);
  // Get Root Nodes Visibility Settings
  useEffect(() => {
    chrome.storage.local.get("rootNodesVisibilitySettings", (result) => {
      if (result.rootNodesVisibilitySettings && Object.keys(result.rootNodesVisibilitySettings).length > 0) {
        setRootNodesVisibilitySettings(result.rootNodesVisibilitySettings);
        setBookmarksVisibilitySettingsIsEmpty(false);
        // console.log("Root nodes visibility settings:", result.rootNodesVisibilitySettings);
      }
    });
  }, []);

  const handleFolderClick = (
    children: chrome.bookmarks.BookmarkTreeNode[],
    title: string
  ) => {
    setFolderStack((prev) => [...prev, currentNodes || []]);
    setTitleStack((prev) => [...prev, title]);
    setCurrentNodes(children);
  };

  const handleBack = () => {
    setCurrentNodes(folderStack[folderStack.length - 1]);
    setFolderStack((prev) => prev.slice(0, -1));
    setTitleStack(titleStack.slice(0, -1));
  };

  const renderRootContent = () => {
    return currentNodes.map((node) => {
      if (!node.children || node.children.length === 0) return null;
      if (!rootNodesVisibilitySettings[node.id] && !bookmarksVisibilitySettingsIsEmpty) return null;

      return (
        <div key={node.id} className="mb-2">
          <BookmarkList
            nodes={node.children}
            onFolderClick={handleFolderClick}
            title={node.title}
          />
        </div>
      );
    });
  };

  const currentTitle = titleStack[titleStack.length - 1];

  return (
    <div className="max-w-2xl px-4 lg:px-0 mx-auto pt-8 pb-52 max-h-screen overflow-y-auto">
      <div className="flex items-center mb-4">
        {folderStack.length > 0 && (
          <button
            className="flex items-center gap-2 opacity-70 font-bold text-lg cursor-pointer mr-10"
            onClick={handleBack}
          >
            <CircleChevronLeftIcon color={textColor} className="w-6 h-6" />
          </button>
        )}

        <details className="dropdown ml-auto">
          <summary className={`btn btn-link btn-circle btn-sm hover:bg-white/5 backdrop-blur-sm custom-text-color`}><EllipsisIcon color={textColor} className="w-4 h-4" /></summary>
          <ul className="menu dropdown-content custom-text-color bg-white/5 backdrop-blur-sm rounded-box mt-1 z-1 w-52 p-2 shadow-sm">
            <li>
              <button
                onClick={() => {
                  chrome.tabs.update({ url: "chrome://bookmarks/" });
                }}
              >
                Manage Bookmarks
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  chrome.runtime.openOptionsPage();
                }}
              >
                Options
              </button>
            </li>
          </ul>
        </details>
      </div>
      <div className="flex flex-col gap-2 group">
        {loading ? (
          <p>Loading bookmarks...</p>
        ) : currentNodes ? (
          folderStack.length === 0 ? (
            renderRootContent()
          ) : (
            <BookmarkList
              nodes={currentNodes}
              onFolderClick={handleFolderClick}
              title={currentTitle}
            />
          )
        ) : (
          <p>No bookmarks found.</p>
        )}
      </div>
      {visibilitySettings.suggestionsList && <SuggestionsList />}
      {visibilitySettings.readingList && <ReadingList />}
    </div>
  );
}

export default App;
