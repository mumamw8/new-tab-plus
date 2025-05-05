import React from "react";
import FaviconOrLetter from "./FaviconOrLetter";
import { getDomain } from "../utils";

const ReadingList: React.FC<{ readingList: chrome.readingList.ReadingListEntry[] }> = ({ readingList }) => {
  return (
    <div className="max-w-4xl mx-auto pt-14">
      <h2 className="text-3xl font-bold mb-6 custom-text-color">Reading List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {readingList.map((item, idx) => (
          <a
            href={item.url}
            title={item.title}
            aria-label={item.title}
            key={idx}
            className="relative flex custom-text-color bg-white/10 rounded-xl shadow-md p-4 items-center gap-4"
          >
            {!item.hasBeenRead && (
              <span
                className="absolute top-2 left-2 w-2 h-2 rounded-full bg-blue-500"
                title="Unread"
              ></span>
            )}
            <FaviconOrLetter title={item.title} url={item.url} size={64} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-lg line-clamp-2 custom-text-color">{item.title}</span>
              </div>
              <div className="text-xs w-full truncate mb-1 custom-text-color">{getDomain(item.url)}</div>
              <div className="text-xs custom-text-color">
                Added: {new Date(item.creationTime).toLocaleDateString()}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ReadingList;
