import FaviconOrLetter from "./FaviconOrLetter";

const BookmarkNode = ({
  node,
  onFolderClick,
}: {
  node: chrome.bookmarks.BookmarkTreeNode;
  onFolderClick?: (children: chrome.bookmarks.BookmarkTreeNode[]) => void;
}) => {
  if (node.url) {
    return (
      <a
        href={node.url}
        className="flex flex-col items-center p-2 cursor-pointer rounded-xl transition-all duration-200"
      >
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
      className="bg-[#23232b] rounded-xl flex flex-col items-center justify-center min-h-[100px] shadow-sm text-center cursor-pointer transition-colors hover:bg-[#2a2a34]"
      onClick={() => onFolderClick && node.children && onFolderClick(node.children)}
      tabIndex={0}
      role="button"
      aria-label={`Open folder ${node.title || "Untitled Folder"}`}
    >
      <div className="w-8 h-8 bg-[#444] rounded-lg flex items-center justify-center text-[22px] text-[#f0eff5] mb-2">
        📁
      </div>
      <span className="text-xs text-[#f0eff5] mx-2 font-medium text-center w-full truncate">
        {node.title}
      </span> 
      {/* <div className="text-[#f0eff5] font-medium text-sm mt-2 break-words">
        {node.title || "Untitled Folder"}
      </div> */}
    </div>
  );
};

export default BookmarkNode;
