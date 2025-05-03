import React from "react";
import BookmarkNode from "./BookmarkNode";

const BookmarkList: React.FC<{
  nodes: chrome.bookmarks.BookmarkTreeNode[];
  onFolderClick?: (children: chrome.bookmarks.BookmarkTreeNode[]) => void;
}> = ({ nodes, onFolderClick }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1 py-2">
      {nodes.map((node) => (
        <BookmarkNode key={node.id} node={node} onFolderClick={onFolderClick} />
      ))}
    </div>
  );
};

export default BookmarkList;
