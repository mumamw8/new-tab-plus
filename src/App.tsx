import { useEffect, useState } from "react";
import "./App.css";
import BookmarkList from "./components/BookmarkList";
import { CircleChevronLeftIcon, EllipsisIcon } from "lucide-react";

function App() {
  const [currentNodes, setCurrentNodes] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [folderStack, setFolderStack] = useState<
    chrome.bookmarks.BookmarkTreeNode[][]
  >([]);
  const [titleStack, setTitleStack] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.bookmarks.getTree((bookMarkTreeNodes) => {
      if (!bookMarkTreeNodes || bookMarkTreeNodes.length === 0) return;
      const root = bookMarkTreeNodes[0];
      setCurrentNodes(root.children || []);
      setLoading(false);
    });
  }, []);

  // Set App Background
  useEffect(() => {
    // get background and text color from storage
    chrome.storage.local.get(["bgType", "color", "textColor"], (result) => {
      console.log("Stored Theme info...", result);
      if (result.bgType === "color") {
        document.body.style.backgroundColor = result.color;
        console.log("Background color set to:", result.color);
      } else if (result.bgType === "image") {
        document.body.style.backgroundImage = `url(${result.image})`;
        console.log("Background image set to:", result.image);
      } else {
        document.body.style.backgroundColor = "black";
        chrome.storage.local.get(["bgType", "color"], (result) => {
          if (!result.bgType) {
            chrome.storage.local
              .set({ bgType: "color", color: "black" })
              .then((result) => {
                console.log(result);
                console.log("Default background color set");
              });
          }
        });
      }
      if (result.textColor) {
        document.body.style.setProperty('--custom-text-color', result.textColor, 'important');
        console.log("Text color set to:", result.textColor);
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
      if (!node.children) return null;
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
    <div className="max-w-4xl mx-auto pt-14">
      <div className="flex items-center mb-4">
        {folderStack.length > 0 && (
          <button
            className="flex items-center gap-2 custom-text-color font-bold text-lg cursor-pointer mr-10"
            onClick={handleBack}
          >
            <CircleChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
        {/* <button
          className="btn btn-primary ml-auto"
          onClick={() => {
            chrome.tabs.update({ url: "chrome://bookmarks/" });
          }}
        >
          Manage
        </button> */}
        <details className="dropdown ml-auto">
          <summary className="btn btn-link btn-circle btn-sm hover:bg-white/5 backdrop-blur-sm text-white"><EllipsisIcon className="w-4 h-4" /></summary>
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
  );
}

export default App;
