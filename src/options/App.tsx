import { useState } from "react";
import "../App.css";

const App = () => {
  const [bgType, setBgType] = useState<"image" | "color">("image");
  const [color, setColor] = useState("#23232b");

  return (
    <div className="p-6 max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded shadow">
      <h2 className="text-xl font-bold mb-4">Background Settings</h2>
      <div className="flex items-center gap-6 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="bgType"
            value="image"
            checked={bgType === "image"}
            onChange={() => setBgType("image")}
            className="radio radio-primary"
          />
          <span>Image background</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="bgType"
            value="color"
            checked={bgType === "color"}
            onChange={() => setBgType("color")}
            className="radio radio-primary"
          />
          <span>Solid color background</span>
        </label>
      </div>
      {bgType === "color" && (
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <span>Pick color:</span>
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </label>
        </div>
      )}
      <div>
        <strong>Preview:</strong>
        <div
          className="mt-2 w-52 h-24 border rounded"
          style={{
            background:
              bgType === "image"
                ? "url('/background-8_x1386.jpg') center/cover"
                : color,
          }}
        />
      </div>
    </div>
  );
};

export default App;
