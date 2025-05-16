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
  'pexels-samuel-hajnik-3231550.jpg': {
    filename: 'pexels-samuel-hajnik-3231550.jpg',
    textColor: '#ffffff',
    credit: {
      name: 'Photo by Samuel Hájnik: https://www.pexels.com/photo/green-grass-and-trees-near-rocky-mountains-14584904/',
      url: 'https://www.pexels.com/photo/green-grass-and-trees-near-rocky-mountains-14584904/',
      description: 'Green grass and trees near rocky mountains'
    }
  },
  'pexels-dr-failov-2151930529.jpg': {
    filename: 'pexels-dr-failov-2151930529.jpg',
    textColor: '#ffffff',
    credit: {
      name: 'Photo by Dr Failov: https://www.pexels.com/photo/aerial-view-of-green-forest-with-circular-structure-31984778/',
      url: 'https://www.pexels.com/photo/aerial-view-of-green-forest-with-circular-structure-31984778/',
      description: 'Aerial view of green forest with circular structure'
    }
  },
  'pexels-jplenio-2080960.jpg': {
    filename: 'pexels-jplenio-2080960.jpg',
    textColor: '#ffffff',
    credit: {
      name: 'Photo by Johannes Plenio: https://www.pexels.com/photo/silhouette-of-person-riding-boat-2080960/',
      url: 'https://www.pexels.com/photo/silhouette-of-person-riding-boat-2080960/',
      description: 'Silhouette of person riding boat'
    }
  },
  'pexels-leonie-fahjen-20345-92866.jpg': {
    filename: 'pexels-leonie-fahjen-20345-92866.jpg',
    textColor: '#ffffff',
    credit: {
      name: 'Photo by Leonie Fahjen: https://www.pexels.com/photo/cars-parked-near-buildings-during-daytime-92866/',
      url: 'https://www.pexels.com/photo/cars-parked-near-buildings-during-daytime-92866/',
      description: 'Cars parked near buildings during daytime'
    }
  },
  'pexels-apyfz-30136066.jpg': {
    filename: 'pexels-apyfz-30136066.jpg',
    textColor: '#ffffff',
    credit: {
      name: 'Photo by Mohammed Alim: https://www.pexels.com/photo/vibrant-jakarta-night-skyline-with-light-streaks-30136066/',
      url: 'https://www.pexels.com/photo/vibrant-jakarta-night-skyline-with-light-streaks-30136066/',
      description: 'Vibrant Jakarta night skyline with light streaks'
    }
  },
  'pexels-pixabay-207153.jpg': {
    filename: 'pexels-pixabay-207153.jpg',
    textColor: '#ffffff',
    credit: {
      name: 'Photo by Pixabay: https://www.pexels.com/photo/gray-tunnel-207153/',
      url: 'https://www.pexels.com/photo/gray-tunnel-207153/',
      description: 'Gray tunnel'
    }
  },
  'pexels-jesserphotonyc-30649768.jpg': {
    filename: 'pexels-jesserphotonyc-30649768.jpg',
    textColor: '#ffffff',
    credit: {
      name: 'Photo by Jesse R: https://www.pexels.com/photo/vibrant-times-square-after-rain-at-dusk-30649768/',
      url: 'https://www.pexels.com/photo/vibrant-times-square-after-rain-at-dusk-30649768/',
      description: 'Vibrant Times Square after rain at dusk'
    }
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