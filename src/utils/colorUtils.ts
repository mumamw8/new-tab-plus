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