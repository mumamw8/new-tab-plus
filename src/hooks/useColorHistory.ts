import { useEffect, useState } from "react";
import useBackgroundColor from "./useBackgroundColor";

function useColorHistory() {
  const { backgroundColor } = useBackgroundColor();
  const [colorHistory, setColorHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem("colorHistory");
    return savedHistory ? JSON.parse(savedHistory).slice(0, 10) : [];
  });

  const clearHistory = () => {
    setColorHistory([]);
    localStorage.removeItem("colorHistory");
  };
  useEffect(() => {
    if (!colorHistory.includes(backgroundColor)) {
      const newHistory = [backgroundColor, ...colorHistory].slice(0, 10);
      setColorHistory(newHistory);
      localStorage.setItem("colorHistory", JSON.stringify(newHistory));
    }
  }, [backgroundColor, colorHistory]);

  return { colorHistory, clearHistory };
}

export default useColorHistory;

// const [colorHistory, setColorHistory] = useState<string[]>(() => {
//   const savedHistory = localStorage.getItem("colorHistory");
//   return savedHistory ? JSON.parse(savedHistory).slice(0, 10) : [];
// });

// in useEffect with colorHistory and backgroundColor as dependency
// // Update history without duplicates
// if (!colorHistory.includes(backgroundColor)) {
//   const newHistory = [backgroundColor, ...colorHistory].slice(0, 10);
//   setColorHistory(newHistory);
//   localStorage.setItem("colorHistory", JSON.stringify(newHistory));
// }

// const clearHistory = () => {
//   setColorHistory([]);
//   localStorage.removeItem("colorHistory");
// };
