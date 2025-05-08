import { useTheme } from "../contexts/ThemeContext";

function useSystemTheme(): "light" | "dark" {
  const { systemTheme } = useTheme();
  return systemTheme;
}

export default useSystemTheme;
