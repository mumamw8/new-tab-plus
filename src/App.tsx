import { useEffect, useState } from "react";
import "./App.css";
import BookmarkList from "./components/BookmarkList";

function App() {
  const [currentNodes, setCurrentNodes] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [folderStack, setFolderStack] = useState<chrome.bookmarks.BookmarkTreeNode[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.bookmarks.getTree((bookMarkTreeNodes) => {
      if (!bookMarkTreeNodes || bookMarkTreeNodes.length === 0) return;
      const root = bookMarkTreeNodes[0];
      setCurrentNodes(root.children || []);
      setLoading(false);
    });
  }, []);

  const handleFolderClick = (children: chrome.bookmarks.BookmarkTreeNode[]) => {
    setFolderStack((prev) => [...prev, currentNodes || []]);
    setCurrentNodes(children);
  };

  const handleBack = () => {
    setCurrentNodes(folderStack[folderStack.length - 1]);
    setFolderStack((prev) => prev.slice(0, -1));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl text-white">Bookmarks</h2>
      {folderStack.length > 0 && (
        <button className="p-2 text-white bg-[#23232b] rounded-xl shadow-sm cursor-pointer transition-colors hover:bg-[#2a2a34]" onClick={handleBack}>
          ← Back
        </button>
      )}
      {loading ? (
        <p>Loading bookmarks...</p>
      ) : currentNodes ? (
        <BookmarkList nodes={currentNodes} onFolderClick={handleFolderClick} />
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  );
}

export default App;
