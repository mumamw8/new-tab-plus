/**
 * Calculates whether to use black or white text based on background color
 * Uses the YIQ formula for perceived brightness
 */
export const calculateTextColor = (backgroundColor: string): string => {
  // Remove the hash if it exists
  const hex = backgroundColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate perceived brightness using YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white based on brightness
  return yiq >= 128 ? "#151516" : "#ffffff";
};

/**
 * Converts hex color to RGB format
 */
export const hexToRgb = (hex: string): string => {
  // Remove the hash if it exists
  const cleanHex = hex.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Generates shade variations of a color
 */
export const generateShades = (
  baseColor: string,
  count: number = 5
): string[] => {
  const shades: string[] = [];
  const hex = baseColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Generate lighter and darker shades
  for (let i = 0; i < count; i++) {
    const factor = 0.8 + i * 0.1; // 0.8, 0.9, 1.0, 1.1, 1.2

    // Calculate new RGB values
    const newR = Math.min(255, Math.round(r * factor));
    const newG = Math.min(255, Math.round(g * factor));
    const newB = Math.min(255, Math.round(b * factor));

    // Convert back to hex
    const newHex =
      "#" +
      newR.toString(16).padStart(2, "0") +
      newG.toString(16).padStart(2, "0") +
      newB.toString(16).padStart(2, "0");

    shades.push(newHex);
  }

  return shades;
};
