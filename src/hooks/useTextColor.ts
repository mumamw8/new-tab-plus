import { useTheme } from "../contexts/ThemeContext";

const useTextColor = () => {
  const { textColor, updateTextColor } = useTheme();

  return { textColor, updateTextColor };
};

export default useTextColor;
