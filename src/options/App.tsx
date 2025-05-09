import "../App.css";
import ThemeCustomizer from "./components/ThemeCustomizer";
import ExtensionSettings from "./components/ExtensionSettings";
import ExtraOptions from "./components/ExtraOptions";
// import { useTheme } from "../contexts/ThemeContext";

const ExtensionOptions = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col transition-colors duration-300 ease-in-out p-4 md:p-8"
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
  return <ExtensionOptions />;
}

export default App;
