import { useTheme } from "../contexts/ThemeContext";

function useIsAutoTextColor() {
  const { isAutoTextColor, toggleIsAutoTextColor } = useTheme();

  return { isAutoTextColor, toggleIsAutoTextColor };
}

export default useIsAutoTextColor;
