import React from "react";
import BookmarkNode from "./BookmarkNode";

const BookmarkList: React.FC<{
  nodes: chrome.bookmarks.BookmarkTreeNode[];
  onFolderClick?: (
    children: chrome.bookmarks.BookmarkTreeNode[],
    title: string,
  ) => void;
  title?: string;
}> = ({ nodes, onFolderClick, title }) => {
  return (
    <>
      {title && <h2 className="text-lg text-white font-bold">{title}</h2>}
      <div className="flex flex-wrap gap-2 py-2">
        {nodes.map((node) => (
          <BookmarkNode
            key={node.id}
            node={node}
            onFolderClick={onFolderClick}
          />
        ))}
      </div>
    </>
  );
};

export default BookmarkList;
