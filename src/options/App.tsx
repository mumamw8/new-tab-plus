// import { useState } from "react";
import { useEffect } from "react";
import "../App.css";
import ThemeCustomizer from "./components/ThemeCustomizer";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const ExtensionOptions = () => {
  // const [bgType, setBgType] = useState<"image" | "color">("image");
  // const [color, setColor] = useState("#23232b");
  const { setBackgroundColor, backgroundColor, textColor } = useTheme();

  useEffect(() => {
    chrome.storage.local.get(["bgType", "color"], (result) => {
      if (result.bgType === "color") {
        setBackgroundColor(result.color);
        console.log("Background color set to in ExtensionOptions:", result.color);
      }
    });
  }, []);

  return (
    <div 
      className="min-h-screen w-full flex flex-col transition-colors duration-300 ease-in-out p-4 md:p-8"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      <div className="p-6 max-w-md ml-auto bg-white/5 backdrop-blur-sm rounded shadow">
        <ThemeCustomizer />
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ExtensionOptions />
    </ThemeProvider>
  );
}

export default App;
