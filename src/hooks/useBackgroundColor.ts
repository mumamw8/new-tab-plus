import { useTheme } from "../contexts/ThemeContext";

const useBackgroundColor = () => {
  const { backgroundColor, updateBackgroundColor } = useTheme();

  return {
    backgroundColor,
    updateBackgroundColor,
  };
};

export default useBackgroundColor;
