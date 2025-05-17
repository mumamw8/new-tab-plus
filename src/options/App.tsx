import "../App.css";
import ThemeCustomizer from "./components/ThemeCustomizer";
import ExtensionSettings from "./components/ExtensionSettings";
import ExtraOptions from "./components/ExtraOptions";
import { useTheme } from "../contexts/ThemeContext";

const ExtensionOptions = () => {
  const { textColor } = useTheme();
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
      <a
          href={'https://tally.so/r/mYyZg0'}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 left-4 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm transition-all duration-300 hover:opacity-80 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap hover:max-w-xs"
          style={{
            backgroundColor: `${textColor}10`,
            color: textColor
          }}
        >
          Report Issue or Give Feedback
        </a>
    </div>
  );
};

function App() {
  return <ExtensionOptions />;
}

export default App;
