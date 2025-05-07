import { useEffect, useState } from "react";
import "./App.css";
import BookmarkList from "./components/BookmarkList";
import { CircleChevronLeftIcon, EllipsisIcon } from "lucide-react";
import ReadingList from "./components/ReadingList";
import SuggestionsList from "./components/SuggestionsList";
import { RootNodesVisibilitySettingsType, VisibilitySettingsType } from "./options/components/ExtensionSettings";
import { getImageUrl } from "./utils";
import useSystemTheme from "./hooks/useSystemTheme";
import useCardStyle from "./hooks/useCardStyle";
import clsx from "clsx";

function App() {
  const systemTheme = useSystemTheme();
  const cardStyle = useCardStyle();

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

  const handleSetTextColorAccordingToSystemTheme = () => {
    document.body.style.setProperty('--custom-text-color', "light-dark(#151516, #ffffff)", 'important');
    if (systemTheme === 'dark') {
      setTextColor('#ffffff');
      // document.body.style.setProperty('--custom-text-color', '#ffffff', 'important');
    } else {
      setTextColor('#151516');
      // document.body.style.setProperty('--custom-text-color', '#151516', 'important');
    }
  }

  const handleSetBackgroundOverlayColorAccordingToSystemTheme = () => {
    if (systemTheme === 'dark') {
      document.body.classList.add('custom-dark-transparent-background-color-class');
    } else {
      document.body.classList.add('custom-light-transparent-background-color-class');
    }
  }

  // const handleSetDefaultBackgroundColorAccordingToSystemTheme = () => {}

  // Set App Background
  useEffect(() => {
    // get background and text color from storage
    chrome.storage.local.get(["bgType", "darkTextColor", "lightTextColor", "darkBackgroundColor", "lightBackgroundColor"], (result) => {
      const imageUrl = getImageUrl(window.innerWidth); // get image url based on window width for if image background is selected
      if (result.bgType === "color") {
        document.body.style.setProperty('--custom-background-color', `light-dark(${result.lightBackgroundColor ?? "#dde3e9"}, ${result.darkBackgroundColor ?? "#3c3c3c"})`, 'important');
        console.log("Background color set to:", `light-dark(${result.lightBackgroundColor ?? "#dde3e9"}, ${result.darkBackgroundColor ?? "#3c3c3c"})`);
        // set background image to none
        document.body.style.setProperty('--custom-background-image', 'none', 'important');
      } else if (result.bgType === "image") {
        handleSetBackgroundOverlayColorAccordingToSystemTheme();
        document.body.style.setProperty('--custom-background-image', `url(${imageUrl})`, 'important');
      } else {
        // set background image to none
        document.body.style.setProperty('--custom-background-image', 'none', 'important');
        document.body.style.setProperty('--custom-background-color', "light-dark(#dde3e9, #3c3c3c)", 'important');
        if (!result.bgType) {
          chrome.storage.local
            .set({ bgType: "color", color: "#3c3c3c", darkBackgroundColor: "#3c3c3c", lightBackgroundColor: "#dde3e9" })
            .then((result) => {
              console.log(result);
              console.log("Default background color set");
            });
        }
      }
      if (result.bgType === "color") {
        if (systemTheme === 'dark') {
          setTextColor(result.darkTextColor);
          console.log("Dark text color set to:", result.darkTextColor);
        } else {
          setTextColor(result.lightTextColor);
          console.log("Light text color set to:", result.lightTextColor);
        }
        document.body.style.setProperty('--custom-text-color', `light-dark(${result.lightTextColor ?? "#151516"}, ${result.darkTextColor ?? "#ffffff"})`, 'important');
        console.log("Text color set to:", `light-dark(${result.lightTextColor ?? "#151516"}, ${result.darkTextColor ?? "#ffffff"})`);
      } else if (result.bgType === "image") {
        handleSetTextColorAccordingToSystemTheme();
      } else {
        handleSetTextColorAccordingToSystemTheme();
      }
    });
  }, [systemTheme]);

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
    <div className="max-h-screen overflow-y-auto scroll-smooth">
      <div className="max-w-2xl px-4 lg:px-0 mx-auto pt-8 pb-52">
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
            <summary className={clsx(`btn btn-link btn-circle btn-sm hover:backdrop-blur-sm custom-text-color`,
              cardStyle === 'neutral' && 'hover:bg-white/5',
              cardStyle === 'light' && 'hover:bg-white/20',
              cardStyle === 'dark' && 'hover:bg-gray-900/20'
            )}>
              <EllipsisIcon color={textColor} className="w-4 h-4" />
            </summary>
            <ul className={clsx("menu dropdown-content custom-text-color backdrop-blur-sm rounded-box mt-1 z-1 w-52 p-2 shadow-sm",
              cardStyle === 'neutral' && 'bg-white/5',
              cardStyle === 'light' && 'bg-white/20',
              cardStyle === 'dark' && 'bg-gray-900/20'
            )}>
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
    </div>
  );
}

export default App;
