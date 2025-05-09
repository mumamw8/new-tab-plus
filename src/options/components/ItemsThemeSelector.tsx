import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Circle } from "lucide-react";
import { useTheme, CardStyle } from "../../contexts/ThemeContext";

const ItemsThemeSelector: React.FC = () => {
  const { cardStyle, textColor, updateCardStyle } = useTheme();
  const [sliderPosition, setSliderPosition] = useState(0);
  const buttonRefs = {
    light: useRef<HTMLButtonElement>(null),
    neutral: useRef<HTMLButtonElement>(null),
    dark: useRef<HTMLButtonElement>(null),
  };

  const updateSliderPosition = (theme: CardStyle) => {
    const button = buttonRefs[theme].current;
    if (button) {
      const container = button.parentElement;
      if (container) {
        const containerLeft = container.getBoundingClientRect().left;
        const buttonLeft = button.getBoundingClientRect().left;
        const relativePosition = buttonLeft - containerLeft;
        setSliderPosition(relativePosition);
      }
    }
  };

  useEffect(() => {
    updateSliderPosition(cardStyle);
    // Update position on window resize
    const handleResize = () => updateSliderPosition(cardStyle);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cardStyle]);

  useEffect(() => {
    document.documentElement.style.setProperty("--card-style", cardStyle);
  }, [cardStyle]);

  const handleThemeChange = (theme: CardStyle) => {
    updateCardStyle(theme);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium">Cards Style</span>
      <div
        className="inline-flex w-max p-1 rounded-xl shadow-inner transition-colors duration-300 relative"
        style={{ backgroundColor: `${textColor}10` }}
      >
        {/* Sliding Background */}
        <div
          className="absolute rounded-full shadow-md transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: `${
              textColor === "#ffffff"
                ? "rgba(40, 40, 40, 0.85)"
                : "rgba(140, 140, 140, 0.15)"
            }`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transform: `translateX(${sliderPosition}px)`,
            width: 10,
            height: buttonRefs[cardStyle].current?.offsetHeight || 0,
          }}
        />

        {/* Light Theme Option */}
        <button
          ref={buttonRefs.light}
          onClick={() => handleThemeChange("light")}
          className={`relative cursor-pointer flex items-center justify-center p-2.5 px-4 rounded-full transition-all duration-300`}
          style={{ color: cardStyle === "light" ? "orange" : textColor }}
          aria-label="Light theme"
        >
          <Sun className="h-5 w-5" />
          <span className="ml-2 text-sm font-medium">Light</span>
        </button>

        {/* Neutral Theme Option */}
        <button
          ref={buttonRefs.neutral}
          onClick={() => handleThemeChange("neutral")}
          className={`relative cursor-pointer flex items-center justify-center p-2.5 px-4 rounded-full transition-all duration-300`}
          style={{ color: cardStyle === "neutral" ? "gray" : textColor }}
          aria-label="Neutral theme"
        >
          <Circle className="h-5 w-5" />
          <span className="ml-2 text-sm font-medium">Neutral</span>
        </button>

        {/* Dark Theme Option */}
        <button
          ref={buttonRefs.dark}
          onClick={() => handleThemeChange("dark")}
          className={`relative cursor-pointer flex items-center justify-center p-2.5 px-4 rounded-full transition-all duration-300`}
          style={{ color: cardStyle === "dark" ? "#a851f4" : textColor }}
          aria-label="Dark theme"
        >
          <Moon className="h-5 w-5" />
          <span className="ml-2 text-sm font-medium">Dark</span>
        </button>
      </div>
    </div>
  );
};

export default ItemsThemeSelector;
