import { useTheme } from "../contexts/ThemeContext";

function useCardStyle() {
  const { cardStyle, updateCardStyle } = useTheme();

  return { cardStyle, updateCardStyle };
}

// export { CardStyle };
export default useCardStyle;
