import React, { useEffect, useState } from 'react'
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react'; 
import { RootNodesVisibilitySettingsType, VisibilitySettingsType } from './ExtensionSettings';

type RootNodesTitleDictionaryType = {
  [nodeId: string]: string;
}
const VisibilitySettings: React.FC = () => {
  const { textColor } = useTheme();
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettingsType>({
    readingList: true,
    suggestionsList: true
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [rootNodesVisibilitySettings, setRootNodesVisibilitySettings] = useState<RootNodesVisibilitySettingsType>({});
  const [rootNodeIds, setRootNodeIds] = useState<string[]>([]);
  const [rootNodesTitleDictionary, setRootNodesTitleDictionary] = useState<RootNodesTitleDictionaryType>({});
  const [showReadingListButton, setShowReadingListButton] = useState(true);

  async function fetchReadingList() {
    const items = await chrome.readingList.query({ hasBeenRead: undefined });
    if (items.length > 0) {
      setShowReadingListButton(true);
    } else {
      setShowReadingListButton(false);
    }
  }

  const toggleVisibility = (section: keyof VisibilitySettingsType) => {
    setVisibilitySettings(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const toggleRootNodeVisibility = (nodeId: string) => {
    setRootNodesVisibilitySettings(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Get and set root node Ids
  useEffect(() => {
    chrome.bookmarks.getTree((bookMarkTreeNodes) => {
      if (!bookMarkTreeNodes || bookMarkTreeNodes.length === 0) return;
      const root = bookMarkTreeNodes[0];
      if (root.children && root.children.length > 0) {
        setRootNodeIds(root.children.map(child => child.id));
        setRootNodesTitleDictionary(root.children.reduce<RootNodesTitleDictionaryType>((acc, child) => {
          acc[child.id] = child.title;
          return acc;
        }, {}));
      }
    }); 
  }, []);
  // Set Root Nodes Visibility Settings
  useEffect(() => {
    if (rootNodeIds.length > 0) {
      // Get or Initialize Root Nodes Visibility Settings
      chrome.storage.local.get(["rootNodesVisibilitySettings"], (result) => {
        if (result.rootNodesVisibilitySettings) {
          setRootNodesVisibilitySettings(result.rootNodesVisibilitySettings);
        } else {
          const rootNodesVisibilitySettingsObject = rootNodeIds.reduce<RootNodesVisibilitySettingsType>(
            (acc, nodeId) => {
              acc[nodeId] = true;
              return acc;
            },
            {}
          );
          chrome.storage.local.set(
            { rootNodesVisibilitySettings: rootNodesVisibilitySettingsObject }
          );
          setRootNodesVisibilitySettings(rootNodesVisibilitySettingsObject);
        }
      });
    }
  }, [rootNodeIds, rootNodeIds.length]);

  useEffect(() => {
    fetchReadingList();
    // Get or Initialize Visibility Settings
    chrome.storage.local.get(["visibilitySettings"], (result) => {
      if (result.visibilitySettings) {
        setVisibilitySettings(result.visibilitySettings);
        console.log("Visibility settings set to in ExtensionOptions:", result.visibilitySettings);
        setIsInitialized(true);
      } else {
        chrome.storage.local.set(
          { visibilitySettings: { readingList: true, suggestionsList: true } }
        );
        setIsInitialized(true);
      }
    });
  }, []);

  useEffect(() => {
    if (isInitialized) {
      chrome.storage.local.set({ visibilitySettings: visibilitySettings });
    }
  }, [visibilitySettings, isInitialized]);

  useEffect(() => {
    if (Object.keys(rootNodesVisibilitySettings).length > 0) {
      chrome.storage.local.set({ rootNodesVisibilitySettings: rootNodesVisibilitySettings });
    }
  }, [rootNodesVisibilitySettings]);


  if (!isInitialized) {
    return null;
  }

  return (
    <div className="w-full" style={{ color: textColor }}>
      <h3 className="text-sm font-medium mb-3">Content Visibility</h3>
      <div className="space-y-3">
        {/* Root Nodes Visibility Settings */}
        <div className='flex flex-col gap-2 p-2 rounded-lg w-full' style={{ backgroundColor: `${textColor}10` }}>
          <h3 className="text-sm">Bookmarks</h3>
          {rootNodeIds.map(nodeId => (
            <button
              key={nodeId}
              onClick={() => toggleRootNodeVisibility(nodeId)}
              className="w-full cursor-pointer flex items-center justify-between p-1 rounded-lg transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10"
              style={{ backgroundColor: `${textColor}10` }}
            >
              <span>{rootNodesTitleDictionary[nodeId]}</span>
              {rootNodesVisibilitySettings[nodeId] ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          ))}
        </div>
        {/* Suggestions List Button */}
        <button
          onClick={() => toggleVisibility('suggestionsList')}
          className="w-full cursor-pointer flex items-center justify-between p-2 rounded-lg transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10"
          style={{ backgroundColor: `${textColor}10` }}
        >
          <span>Suggestions List</span>
          {visibilitySettings.suggestionsList ? (
            <Eye size={18} />
          ) : (
            <EyeOff size={18} />
          )}
        </button>

        {/* Reading List Button */}
        {showReadingListButton && (
          <button
            onClick={() => toggleVisibility('readingList')}
            className="w-full cursor-pointer flex items-center justify-between p-2 rounded-lg transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10"
            style={{ backgroundColor: `${textColor}10` }}
        >
          <span>Reading List</span>
          {visibilitySettings.readingList ? (
            <Eye size={18} />
          ) : (
            <EyeOff size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default VisibilitySettings;