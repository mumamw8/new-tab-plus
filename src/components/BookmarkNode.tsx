import FaviconOrLetter from "./FaviconOrLetter";

const BookmarkNode = ({
  node,
  onFolderClick,
}: {
  node: chrome.bookmarks.BookmarkTreeNode;
  onFolderClick?: (
    children: chrome.bookmarks.BookmarkTreeNode[],
    title: string,
  ) => void;
}) => {
  const baseClasses = `flex flex-col items-center cursor-pointer rounded-xl transition-all duration-200 max-w-28`;

  if (node.url) {
    return (
      <a href={node.url} className={baseClasses}>
        <FaviconOrLetter title={node.title} url={node.url} size={64} />
        <span className="text-xs text-[#f0eff5] font-medium text-center w-full truncate">
          {node.title}
        </span>
      </a>
    );
  }

  // Folder
  return (
    <div
      className={baseClasses}
      onClick={() =>
        onFolderClick &&
        node.children &&
        onFolderClick(node.children, node.title)
      }
      tabIndex={0}
      role="button"
      aria-label={`Open folder ${node.title || "Untitled Folder"}`}
    >
      <div
        className={`relative flex items-center text-2xl justify-center w-16 h-16 mb-2 rounded-2xl bg-white/5 backdrop-blur-sm shadow-md transition-all duration-200 overflow-hidden`}
      >
        📁
      </div>
      <span className="text-xs text-[#f0eff5] font-medium text-center w-full truncate">
        {node.title}
      </span>
    </div>
  );
};

export default BookmarkNode;
