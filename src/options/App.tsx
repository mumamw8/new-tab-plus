import { useEffect } from "react";
import "../App.css";
import ThemeCustomizer from "./components/ThemeCustomizer";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import ExtensionSettings from "./components/ExtensionSettings";
import ExtraOptions from "./components/ExtraOptions";
import useSystemTheme from "../hooks/useSystemTheme";

const ExtensionOptions = () => {
  const { setBackgroundColor, backgroundColor, textColor } = useTheme();
  const systemTheme = useSystemTheme();

  useEffect(() => {
    chrome.storage.local.get(["bgType", "darkBackgroundColor", "lightBackgroundColor"], (result) => {
      if (result.bgType === "color") {
        if (systemTheme === 'dark') {
          setBackgroundColor(result.darkBackgroundColor);
          console.log("Background color set to in ExtensionOptions:", result.darkBackgroundColor);
        } else {
          setBackgroundColor(result.lightBackgroundColor);
          console.log("Background color set to in ExtensionOptions:", result.lightBackgroundColor);
        }
      }
    });
  }, [systemTheme]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col transition-colors duration-300 ease-in-out p-4 md:p-8"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      <div className="flex flex-wrap-reverse w-full justify-end gap-4">
        {/* Settings Container */}
        <div className="p-6 max-w-md bg-white/5 backdrop-blur-sm rounded shadow mb-6">
          <ExtensionSettings />
        </div>
        <div className="p-6 max-w-md bg-white/5 backdrop-blur-sm rounded shadow mb-6">
          <ThemeCustomizer />
        </div>
        {/* New Background Image Toggle Container */}
        <div className="p-6 max-w-md bg-white/5 backdrop-blur-sm rounded shadow mb-6">
          <ExtraOptions />
        </div>
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
