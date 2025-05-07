import clsx from "clsx";
import FaviconOrLetter from "./FaviconOrLetter";
import useCardStyle from "../hooks/useCardStyle";

const BookmarkNode = ({
  node,
  onFolderClick,
}: {
  node: chrome.bookmarks.BookmarkTreeNode;
  onFolderClick?: (
    children: chrome.bookmarks.BookmarkTreeNode[],
    title: string
  ) => void;
}) => {
  const { cardStyle } = useCardStyle();
  const baseClasses = `flex flex-col items-center cursor-pointer rounded-xl transition-all duration-200 w-[72px]`;

  if (node.url) {
    return (
      <a
        href={node.url}
        className={baseClasses}
        title={node.title} // Add title attribute
        aria-label={node.title} // Add aria-label for accessibility
      >
        <FaviconOrLetter title={node.title} url={node.url} iconSize={64} />
        <span className="text-[0.7rem] leading-3 custom-text-color font-medium text-center w-full line-clamp-2">
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
      title={node.title || "Untitled Folder"} // Add title attribute
    >
      <div
        className={clsx(
          `relative flex items-center text-2xl justify-center w-16 h-16 mb-2 rounded-2xl backdrop-blur-sm shadow-md transition-all duration-200 overflow-hidden`,
          cardStyle === 'neutral' && 'bg-white/5',
          cardStyle === 'light' && 'bg-white/20',
          cardStyle === 'dark' && 'bg-gray-900/20'
        )}
      >
        📁
      </div>
      <span className="text-[0.7rem] leading-3 custom-text-color font-medium text-center w-full line-clamp-2">
        {node.title}
      </span>
    </div>
  );
};

export default BookmarkNode;
