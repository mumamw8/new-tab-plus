/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface WallpaperInfo {
  filename: string;
  textColor: string;
  credit?: {
    name: string;
    url: string;
    description?: string;
  };
}

const WALLPAPERS: Record<string, WallpaperInfo> = {
  'background-15_x1032.jpg': {
    filename: 'background-15_x1032.jpg',
    textColor: '#ffffff'
  },
  'background-18_x2060.jpg': {
    filename: 'background-18_x2060.jpg',
    textColor: '#ffffff'
  },
  'background-8_x1386.jpg': {
    filename: 'background-8_x1386.jpg',
    textColor: '#ffffff'
  }
};

const WallpaperSelector: React.FC = () => {
  const { theme, updateTheme } = useTheme();
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | undefined>(theme.background.wallpaper);

  useEffect(() => {
    setSelectedWallpaper(theme.background.wallpaper);
  }, [theme.background.wallpaper]);

  const handleWallpaperSelect = (wallpaperKey: string) => {
    const wallpaper = WALLPAPERS[wallpaperKey];
    setSelectedWallpaper(wallpaperKey);
    updateTheme({
      background: {
        ...theme.background,
        type: 'wallpaper',
        wallpaper: wallpaperKey
      },
      text: {
        ...theme.text,
        color: wallpaper.textColor
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium">Select Wallpaper</span>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(WALLPAPERS).map(([key, wallpaper]) => (
          <div
            key={key}
            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedWallpaper === key ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleWallpaperSelect(key)}
          >
            <img
              src={`/wallpapers/${wallpaper.filename}`}
              alt={wallpaper.filename}
              className="w-full h-32 object-cover"
            />
            <div
              className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-300"
              style={{ backgroundColor: selectedWallpaper === key ? 'rgba(59, 130, 246, 0.2)' : '' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WallpaperSelector; 