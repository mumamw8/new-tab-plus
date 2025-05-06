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

export const calculateImageBrightness = (image: HTMLImageElement): number => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 255; // Default to white background

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let totalBrightness = 0;
  let pixelCount = 0;

  // Step over pixels to improve performance
  const step = 4 * 10;
  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    totalBrightness += brightness;
    pixelCount++;
  }

  return totalBrightness / pixelCount;
};

export const getTextColorForBrightness = (brightness: number): string => {
  return brightness < 128 ? "#151516" : "#ffffff";
};
