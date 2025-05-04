import { useEffect, useState } from "react";
import "./App.css";
import BookmarkList from "./components/BookmarkList";
import { CircleChevronLeftIcon } from "lucide-react";

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
      {folderStack.length > 0 && (
        <button
          className="flex items-center gap-2 text-white font-bold text-lg cursor-pointer mr-10"
          onClick={handleBack}
        >
          <CircleChevronLeftIcon className="w-6 h-6" />
        </button>
      )}
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
