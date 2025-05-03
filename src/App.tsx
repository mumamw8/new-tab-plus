import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import BookmarkList from "./components/BookmarkList";

function App() {
  const [count, setCount] = useState(0);

  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[] | undefined
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.bookmarks.getTree((bookMarkTreeNodes) => {
      if (!bookMarkTreeNodes || bookMarkTreeNodes.length === 0) return;
      const root = bookMarkTreeNodes[0]; // Root node
      setBookmarks(root.children); // Set the bookmarks to the children of the root node
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2>Bookmarks</h2>
      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarks ? (
        <BookmarkList nodes={bookmarks} />
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  );

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
