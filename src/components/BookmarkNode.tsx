const BookmarkNode = ({
  node,
}: {
  node: chrome.bookmarks.BookmarkTreeNode;
}) => {
  if (node.url) {
    return (
      <a
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#f0eff5" }}
      >
        {node.title || "(No title)"}
      </a>
    );
  }

  return (
    <details open>
      <summary style={{ fontWeight: "bold" }}>
        {node.title || "Untitled Folder"}
      </summary>
      {node.children && node.children.length > 0 ? (
        <ul style={{ paddingLeft: "15px", margin: "5px 0" }}>
          {node.children.map((child) => (
            <li key={child.id}>
              <BookmarkNode node={child} />
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: "5px 0 0 15px", fontStyle: "italic" }}>
          Empty folder
        </p>
      )}
    </details>
  );
};

export default BookmarkNode;
