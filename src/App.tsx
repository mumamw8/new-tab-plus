import { useEffect, useState } from "react";
import "./App.css";
import BookmarkList from "./components/BookmarkList";
import { CircleChevronLeftIcon, EllipsisIcon } from "lucide-react";
import ReadingList from "./components/ReadingList";
import SuggestionsList from "./components/SuggestionsList";
import {
  RootNodesVisibilitySettingsType,
  VisibilitySettingsType,
} from "./options/components/ExtensionSettings";
// import { getImageUrl } from "./utils";
import clsx from "clsx";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const {
    // systemTheme,
    cardStyle,
    textColor,
    // backgroundColor,
    bgType,
    theme
  } = useTheme();

  const [currentNodes, setCurrentNodes] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [folderStack, setFolderStack] = useState<
    chrome.bookmarks.BookmarkTreeNode[][]
  >([]);
  const [titleStack, setTitleStack] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [textPageColor, setTextPageColor] = useState<string>(
    textColor ?? "#ffffff"
  );
  const [visibilitySettings, setVisibilitySettings] =
    useState<VisibilitySettingsType>({
      readingList: true,
      suggestionsList: true,
    });
  const [rootNodesVisibilitySettings, setRootNodesVisibilitySettings] =
    useState<RootNodesVisibilitySettingsType>({});
  const [
    bookmarksVisibilitySettingsIsEmpty,
    setBookmarksVisibilitySettingsIsEmpty,
  ] = useState(true);

  // const handleSetTextColorAccordingToSystemTheme = () => {
  //   document.body.style.setProperty('--custom-text-color', "light-dark(#151516, #ffffff)", 'important');
  //   if (systemTheme === 'dark') {
  //     setTextPageColor('#ffffff');
  //   } else {
  //     setTextPageColor('#151516');
  //   }
  // }
  // const handleSetBackgroundOverlayColorAccordingToSystemTheme = () => {
  //   if (systemTheme === 'dark') {
  //     document.body.classList.add('custom-dark-transparent-background-color-class');
  //   } else {
  //     document.body.classList.add('custom-light-transparent-background-color-class');
  //   }
  // }

  useEffect(() => {
    chrome.bookmarks.getTree((bookMarkTreeNodes) => {
      if (!bookMarkTreeNodes || bookMarkTreeNodes.length === 0) return;
      const root = bookMarkTreeNodes[0];
      setCurrentNodes(root.children || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setTextPageColor(textColor);
  }, [textColor]);

  // Get Visibility Settings
  useEffect(() => {
    chrome.storage.local.get("visibilitySettings", (result) => {
      if (result.visibilitySettings) {
        setVisibilitySettings(result.visibilitySettings);
      }
    });
  }, []);

  // Get Root Nodes Visibility Settings
  useEffect(() => {
    chrome.storage.local.get("rootNodesVisibilitySettings", (result) => {
      if (
        result.rootNodesVisibilitySettings &&
        Object.keys(result.rootNodesVisibilitySettings).length > 0
      ) {
        setRootNodesVisibilitySettings(result.rootNodesVisibilitySettings);
        setBookmarksVisibilitySettingsIsEmpty(false);
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
      if (
        !rootNodesVisibilitySettings[node.id] &&
        !bookmarksVisibilitySettingsIsEmpty
      )
        return null;

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
              <CircleChevronLeftIcon
                color={textPageColor}
                className="w-6 h-6"
              />
            </button>
          )}

          <details className="dropdown ml-auto">
            <summary
              className={clsx(
                `btn btn-link btn-circle btn-sm hover:backdrop-blur-sm custom-text-color`,
                cardStyle === "neutral" && "hover:bg-white/5",
                cardStyle === "light" && "hover:bg-white/20",
                cardStyle === "dark" && "hover:bg-gray-900/20"
              )}
            >
              <EllipsisIcon color={textPageColor} className="w-4 h-4" />
            </summary>
            <ul
              className={clsx(
                "menu dropdown-content custom-text-color backdrop-blur-sm rounded-box mt-1 z-1 w-52 p-2 shadow-sm",
                cardStyle === "neutral" && "bg-white/5",
                cardStyle === "light" && "bg-white/20",
                cardStyle === "dark" && "bg-gray-900/20"
              )}
            >
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
      {bgType === 'wallpaper' && theme.background.wallpaperCredit && (
        <a
          href={theme.background.wallpaperCredit.url}
          className="fixed bottom-4 left-4 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm transition-all duration-300 hover:opacity-80 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap hover:max-w-xs"
          style={{
            backgroundColor: `${textColor}10`,
            color: textColor
          }}
        >
          {theme.background.wallpaperCredit.name}
        </a>
      )}
    </div>
  );
}

export default App;
