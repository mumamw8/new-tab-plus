import React from "react";
import BookmarkNode from "./BookmarkNode";

const BookmarkList: React.FC<{
  nodes: chrome.bookmarks.BookmarkTreeNode[];
}> = ({ nodes }) => {
  return (
    <ul style={{ paddingLeft: "15px", margin: 0, listStyleType: "none" }}>
      {nodes.map((node) => (
        <li key={node.id}>
          <BookmarkNode node={node} />
        </li>
      ))}
    </ul>
  );
};

export default BookmarkList;
