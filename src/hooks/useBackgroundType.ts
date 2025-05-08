import { useTheme } from "../contexts/ThemeContext";

const useBackgroundType = () => {
  const { bgType, updateBgType } = useTheme();

  return { bgType, updateBgType };
};

// export { BackgroundType };
export default useBackgroundType;
