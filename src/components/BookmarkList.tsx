import React from "react";
import BookmarkNode from "./BookmarkNode";

const BookmarkList: React.FC<{
  nodes: chrome.bookmarks.BookmarkTreeNode[];
  onFolderClick?: (children: chrome.bookmarks.BookmarkTreeNode[]) => void;
}> = ({ nodes, onFolderClick }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6 py-6">
      {nodes.map((node) => (
        <BookmarkNode key={node.id} node={node} onFolderClick={onFolderClick} />
      ))}
    </div>
  );
};

export default BookmarkList;
