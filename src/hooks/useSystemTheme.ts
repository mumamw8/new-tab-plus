import { useState } from "react";

function useSystemTheme(): "light" | "dark" {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  // Only get the value once, no effect needed
  const [systemTheme] = useState<"light" | "dark">(getSystemTheme());

  return systemTheme;
}

export default useSystemTheme;

// useEffect(() => {
//   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//   const handleChange = (e: MediaQueryListEvent) => {
//     setSystemTheme(e.matches ? "dark" : "light");
//   };
//   mediaQuery.addEventListener("change", handleChange);
//   return () => {
//     mediaQuery.removeEventListener("change", handleChange);
//   };
// }, []);
