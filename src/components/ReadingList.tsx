import React, { useState } from "react";
import FaviconOrLetter from "./FaviconOrLetter";
import { getDomain } from "../utils";
import { formatDistance } from "date-fns";
import { ChevronRightIcon } from "lucide-react";
import { ChevronLeftIcon } from "lucide-react";

const MAX_ITEMS = 6;

const ReadingList: React.FC<{ readingList: chrome.readingList.ReadingListEntry[] }> = ({ readingList }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? readingList : readingList.slice(0, MAX_ITEMS);

  return (
    <div className="max-w-4xl mx-auto pt-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold custom-text-color">Reading List</h2>
        {readingList.length > MAX_ITEMS && (
          <button
            className="flex items-center gap-2 custom-text-color font-bold underline cursor-pointer mr-10"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show Less" : "Show All"}
            {showAll ? <ChevronLeftIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </button>
        )} 
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleItems.map((item, idx) => (
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
                {/* Added: {new Date(item.creationTime).toLocaleDateString()} */}
                {formatDistance(new Date(item.creationTime), new Date(), { addSuffix: true })}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ReadingList;
